const VenueCluster = require('../models/VenueCluster');
const Court = require('../models/Court');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');
const PricingRule = require('../models/PricingRule');
const Notification = require('../models/Notification');

// GET /api/owner/dashboard?range=today|week
const getOwnerDashboard = async (req, res) => {
  try {
    const { range = 'today' } = req.query;
    const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
    const clusterIds = myClusters.map(c => c._id);
    const courts = await Court.find({ cluster_id: { $in: clusterIds } }).select('_id');
    const courtIds = courts.map(c => c._id);

    const now = new Date();
    let dateFrom = new Date(now.setHours(0, 0, 0, 0));
    if (range === 'week') dateFrom.setDate(dateFrom.getDate() - 7);

    const bookings = await Booking.find({
      court_id: { $in: courtIds },
      payment_status: 'PAID',
      created_at: { $gte: dateFrom },
    });

    const revenue = bookings.reduce((sum, b) => sum + b.subtotal, 0);
    const occupancy = bookings.length;

    res.status(200).json({ revenue, occupancy, booking_count: bookings.length });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/owner/venues/:id
const updateVenue = async (req, res) => {
  try {
    const { description, amenities, images } = req.body;
    const venue = await VenueCluster.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Không tìm thấy cụm sân' });
    if (venue.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa sân này' });
    }
    Object.assign(venue, { description, amenities, images });
    await venue.save();
    res.status(200).json(venue);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// GET /api/owner/courts?cluster_id=...
const getOwnerCourts = async (req, res) => {
  try {
    const { cluster_id } = req.query;
    const query = {};
    if (cluster_id) {
      const cluster = await VenueCluster.findOne({ _id: cluster_id, owner_id: req.user._id });
      if (!cluster) return res.status(403).json({ message: 'Không có quyền truy cập cụm sân này' });
      query.cluster_id = cluster_id;
    } else {
      const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
      query.cluster_id = { $in: myClusters.map(c => c._id) };
    }
    const courts = await Court.find(query).populate('sport_type_id', 'name');
    res.status(200).json(courts);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/owner/pricing-rules
const createPricingRule = async (req, res) => {
  try {
    const { court_id, day_type, slot_start, slot_end, price_per_slot, label, priority } = req.body;
    // Kiểm tra quyền sở hữu sân
    const court = await Court.findById(court_id).populate('cluster_id');
    if (!court || court.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền cấu hình sân này' });
    }
    const rule = await PricingRule.create({ court_id, day_type, slot_start, slot_end, price_per_slot, label, priority });
    res.status(201).json(rule);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// GET /api/owner/time-slots?date=YYYY-MM-DD&cluster_id=...
const getOwnerTimeSlots = async (req, res) => {
  try {
    const { date, cluster_id } = req.query;
    if (!date) return res.status(400).json({ message: 'Thiếu tham số date' });

    let courtQuery = {};
    if (cluster_id) {
      courtQuery.cluster_id = cluster_id;
    } else {
      const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
      courtQuery.cluster_id = { $in: myClusters.map(c => c._id) };
    }
    const courts = await Court.find(courtQuery).select('_id name');
    const courtIds = courts.map(c => c._id);

    const slots = await TimeSlot.find({
      court_id: { $in: courtIds },
      slot_date: new Date(date),
    }).sort('start_time').populate('court_id', 'name');

    res.status(200).json(slots);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/owner/time-slots/block
const blockSlots = async (req, res) => {
  try {
    const { time_slot_ids, block_reason } = req.body;
    if (!time_slot_ids?.length) return res.status(400).json({ message: 'Thiếu danh sách slot' });

    // Xác thực quyền sở hữu cho TẤT CẢ các slots
    const slotsToBlock = await TimeSlot.find({ _id: { $in: time_slot_ids } })
      .populate({
        path: 'court_id',
        populate: { path: 'cluster_id', select: 'owner_id' }
      });

    const isAllOwnedByMe = slotsToBlock.every(s => 
      s.court_id?.cluster_id?.owner_id?.toString() === req.user._id.toString()
    );

    if (!isAllOwnedByMe || slotsToBlock.length === 0) {
      return res.status(403).json({ message: 'Bạn không có quyền khóa một hoặc nhiều slot trong danh sách này' });
    }

    await TimeSlot.updateMany(
      { _id: { $in: time_slot_ids }, status: 'AVAILABLE' },
      { status: 'BLOCKED', blocked_by: req.user._id, block_reason: block_reason || 'Khóa thủ công' }
    );

    res.status(200).json({ message: `Đã khóa ${time_slot_ids.length} slot thành công` });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/owner/bookings?status=...&date=...
const getOwnerBookings = async (req, res) => {
  try {
    const { status, date } = req.query;
    const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
    const courts = await Court.find({ cluster_id: { $in: myClusters.map(c => c._id) } }).select('_id');
    const courtIds = courts.map(c => c._id);

    const query = { court_id: { $in: courtIds } };
    if (status) query.status = status;
    if (date) query.booking_date = new Date(date);

    const bookings = await Booking.find(query)
      .populate('user_id', 'name phone')
      .populate('court_id', 'name')
      .sort('-created_at');

    res.status(200).json(bookings);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/owner/reports?month=...&year=...
const getOwnerReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
    const courts = await Court.find({ cluster_id: { $in: myClusters.map(c => c._id) } }).select('_id');

    const matchStage = { court_id: { $in: courts.map(c => c._id) }, payment_status: 'PAID' };
    if (month && year) {
      const from = new Date(year, month - 1, 1);
      const to = new Date(year, month, 1);
      matchStage.created_at = { $gte: from, $lt: to };
    }

    const report = await Booking.aggregate([
      { $match: matchStage },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$booking_date' } },
        daily_subtotal: { $sum: '$subtotal' },
        booking_count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } }
    ]);

    const totalSubtotal = report.reduce((sum, r) => sum + r.daily_subtotal, 0);
    res.status(200).json({ total_revenue: totalSubtotal, daily: report });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  getOwnerDashboard, updateVenue, getOwnerCourts,
  createPricingRule, getOwnerTimeSlots, blockSlots,
  getOwnerBookings, getOwnerReport
};
