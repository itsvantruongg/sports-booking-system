const SportType = require('../models/SportType');
const VenueCluster = require('../models/VenueCluster');
const Court = require('../models/Court');
const Review = require('../models/Review');
const TimeSlot = require('../models/TimeSlot');

// GET /api/public/sport-types
const getSportTypes = async (req, res) => {
  try {
    const sports = await SportType.find({ is_active: true }).sort('name');
    res.status(200).json(sports);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/public/venues?sport=<id>&city=...&district=...&date=...
const getPublicVenues = async (req, res) => {
  try {
    const { sport, city, district, q, date, page = 1, limit = 12 } = req.query;

    // Build query cụm sân
    const venueQuery = { status: 'ACTIVE' };
    if (city) venueQuery.city = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (district) venueQuery.district = new RegExp(district.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (q) {
      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      venueQuery.$or = [
        { name: new RegExp(safeQ, 'i') },
        { address: new RegExp(safeQ, 'i') },
        { city: new RegExp(safeQ, 'i') },
        { district: new RegExp(safeQ, 'i') }
      ];
    }

    let clusterIds;

    // Nếu có lọc theo môn thể thao, tìm các cluster có court thỏa điều kiện
    if (sport) {
      const courts = await Court.find({ sport_type_id: sport, status: 'ACTIVE' }).distinct('cluster_id');
      venueQuery._id = { $in: courts };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await VenueCluster.countDocuments(venueQuery);
    const clusters = await VenueCluster.find(venueQuery)
      .skip(skip).limit(Number(limit)).lean();

    // Tính rating trung bình cho từng cụm
    const results = await Promise.all(clusters.map(async (cluster) => {
      const ratingAgg = await Review.aggregate([
        { $match: { cluster_id: cluster._id } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      const rating = ratingAgg[0] || { avg: 0, count: 0 };
      return { ...cluster, avg_rating: Number(rating.avg.toFixed(1)), review_count: rating.count };
    }));

    res.status(200).json({ total, page: Number(page), data: results });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/public/venues/:id
const getVenueDetail = async (req, res) => {
  try {
    const cluster = await VenueCluster.findById(req.params.id).lean();
    if (!cluster) return res.status(404).json({ message: 'Không tìm thấy cụm sân' });

    const courts = await Court.find({ cluster_id: cluster._id, status: 'ACTIVE' })
      .populate('sport_type_id', 'name icon_url');

    const reviews = await Review.find({ cluster_id: cluster._id })
      .populate('user_id', 'name').sort('-created_at').limit(20);

    const ratingAgg = await Review.aggregate([
      { $match: { cluster_id: cluster._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const rating = ratingAgg[0] || { avg: 0, count: 0 };

    res.status(200).json({
      ...cluster,
      avg_rating: Number((rating.avg || 0).toFixed(1)),
      review_count: rating.count,
      courts,
      reviews,
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/public/courts/:id/time-slots?date=YYYY-MM-DD
const getCourtTimeSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Thiếu tham số date (YYYY-MM-DD)' });

    const court = await Court.findById(req.params.id);
    if (!court) return res.status(404).json({ message: 'Không tìm thấy sân' });

    // Đảm bảo lấy đúng ngày theo giờ UTC để khớp với cách lưu trong DB
    const startOfDay = new Date(date + "T00:00:00.000Z");
    const endOfDay = new Date(date + "T23:59:59.999Z");

    console.log(`[PublicAPI] Fetching slots for court ${req.params.id} on ${date} (UTC: ${startOfDay.toISOString()} - ${endOfDay.toISOString()})`);

    // --- XỬ LÝ NHẢ SLOT QUÁ HẠN 5 PHÚT ---
    const Booking = require('../models/Booking');
    const nowTime = new Date();
    
    // Tìm các booking bị quá hạn (5 phút chưa xác nhận)
    const expiredBookings = await Booking.find({
      court_id: req.params.id,
      status: 'PENDING',
      expires_at: { $lt: nowTime, $ne: null }
    });

    if (expiredBookings.length > 0) {
      console.log(`[PublicAPI] Found ${expiredBookings.length} expired bookings. Cleaning up...`);
      for (const b of expiredBookings) {
        b.status = 'CANCELLED';
        b.cancel_reason = 'Hết thời gian thanh toán 5 phút';
        b.payment_status = 'REFUNDED';
        b.expires_at = null;
        b.cancelled_at = new Date();
        await b.save();

        const slotIds = b.booked_slots.map(s => s.time_slot_id);
        await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });
      }
    }
    // ------------------------------------

    let slots = await TimeSlot.find({
      court_id: req.params.id,
      slot_date: { $gte: startOfDay, $lte: endOfDay },
      status: 'AVAILABLE',
    }).sort('start_time');

    // TỐI ƯU: Lazy Generation - Nếu chưa có lịch, sinh ngay lúc khách cần xem
    if (slots.length === 0) {
      const { generateSlotsForCourt } = require('../utils/cronJobs');
      console.log(`[PublicAPI] No slots found for ${date}. Triggering lazy generation...`);
      await generateSlotsForCourt(req.params.id, date, date);

      // Lấy lại sau khi sinh
      slots = await TimeSlot.find({
        court_id: req.params.id,
        slot_date: { $gte: startOfDay, $lte: endOfDay },
        status: 'AVAILABLE',
      }).sort('start_time');
    }

    console.log(`[PublicAPI] Found ${slots.length} available slots.`);

    // Lọc bỏ các ca đã quá giờ nếu là ngày hôm nay
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let results = slots;
    if (date === todayStr) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      results = slots.filter(slot => {
        const [slotHour, slotMin] = slot.start_time.split(':').map(Number);
        // Chỉ hiện các ca bắt đầu sau giờ hiện tại
        if (slotHour > currentHour) return true;
        if (slotHour === currentHour && slotMin > currentMinute) return true;
        return false;
      });
    }

    res.status(200).json(results);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getSportTypes, getPublicVenues, getVenueDetail, getCourtTimeSlots };
