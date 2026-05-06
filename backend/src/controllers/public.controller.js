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
    const { sport, city, district, date, page = 1, limit = 12 } = req.query;

    // Build query cụm sân
    const venueQuery = { status: 'ACTIVE' };
    if (city) venueQuery.city = new RegExp(city, 'i');
    if (district) venueQuery.district = new RegExp(district, 'i');

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

    const slotDate = new Date(date);
    const slots = await TimeSlot.find({
      court_id: req.params.id,
      slot_date: slotDate,
      status: 'AVAILABLE',
    }).sort('start_time');

    res.status(200).json(slots);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getSportTypes, getPublicVenues, getVenueDetail, getCourtTimeSlots };
