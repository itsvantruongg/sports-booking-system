const User = require('../models/User');
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Review = require('../models/Review');
const VenueCluster = require('../models/VenueCluster');
const Court = require('../models/Court');
const Notification = require('../models/Notification');

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-refresh_token');
    res.status(200).json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/users/me — chỉ cho sửa name & phone, không cho sửa email
const updateMe = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-refresh_token');
    res.status(200).json(user);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// POST /api/users/bookings — Giữ chỗ & Tạo bill
const createBooking = async (req, res) => {
  try {
    const { court_id, booking_date, time_slot_ids } = req.body;
    if (!court_id || !booking_date || !time_slot_ids?.length) {
      return res.status(400).json({ message: 'Thiếu thông tin đặt sân' });
    }

    // Kiểm tra & khóa slots
    const slots = await TimeSlot.find({
      _id: { $in: time_slot_ids },
      status: 'AVAILABLE',
    }).sort('start_time');

    if (slots.length !== time_slot_ids.length) {
      return res.status(409).json({ message: 'Một số khung giờ đã bị đặt, vui lòng chọn lại' });
    }

    // Kiểm tra chặn đặt ca quá giờ (nếu đặt cho ngày hôm nay)
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const bookingDateStr = new Date(booking_date).toISOString().split('T')[0];

    if (bookingDateStr === todayStr) {
      const firstSlot = slots[0];
      const [slotHour, slotMin] = firstSlot.start_time.split(':').map(Number);
      if (slotHour < now.getHours() || (slotHour === now.getHours() && slotMin <= now.getMinutes())) {
        return res.status(400).json({ message: 'Không thể đặt ca đã trôi qua trong ngày' });
      }
    }

    // Tính tiền
    const subtotal = slots.reduce((sum, s) => sum + s.price, 0);
    const platform_fee = Math.round(subtotal * 0.05);
    const total_price = subtotal + platform_fee;
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    const booking = await Booking.create({
      user_id: req.user._id,
      court_id,
      booking_date: new Date(booking_date),
      start_time: slots[0].start_time,
      end_time: slots[slots.length - 1].end_time,
      slot_count: slots.length,
      subtotal,
      platform_fee,
      total_price,
      payment_method: 'TRANSFER', // Mặc định chuyển khoản cho online booking
      payment_status: 'PENDING',
      status: 'PENDING',
      expires_at,
      booked_slots: slots.map(s => ({ time_slot_id: s._id, slot_price: s.price })),
    });

    // Khóa các slot lại
    await TimeSlot.updateMany({ _id: { $in: time_slot_ids } }, { status: 'BOOKED' });

    res.status(201).json({
      booking_id: booking._id,
      total_price,
      expires_at,
      // payment_url sẽ thêm sau khi tích hợp cổng thanh toán
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/users/bookings?status=UPCOMING|COMPLETED
const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user_id: req.user._id };

    if (status === 'UPCOMING') query.status = { $in: ['PENDING', 'CONFIRMED'] };
    else if (status === 'COMPLETED') query.status = { $in: ['COMPLETED', 'CANCELLED'] };

    const bookings = await Booking.find(query)
      .populate({
        path: 'court_id',
        select: 'name cluster_id',
        populate: { path: 'cluster_id', select: 'name address district city' }
      })
      .sort('-created_at');
    res.status(200).json(bookings);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/users/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'court_id', populate: { path: 'cluster_id', select: 'name address' } })
      .populate('booked_slots.time_slot_id', 'start_time end_time');

    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền xem đơn này' });
    }

    res.status(200).json(booking);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/users/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const { cancel_reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn này' });
    }
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return res.status(400).json({ message: 'Không thể hủy đơn ở trạng thái này' });
    }

    // Nhả slot về AVAILABLE
    const slotIds = booking.booked_slots.map(s => s.time_slot_id);
    await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });

    booking.status = 'CANCELLED';
    booking.cancel_reason = cancel_reason;
    booking.cancelled_at = new Date();
    await booking.save();

    res.status(200).json({ message: 'Hủy đặt sân thành công' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/users/reviews
const createReview = async (req, res) => {
  try {
    const { cluster_id, rating, comment } = req.body;

    if (!cluster_id || !rating) return res.status(400).json({ message: 'Thiếu thông tin đánh giá' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });

    // Kiểm tra user đã từng đặt sân tại đây chưa
    const hasCompleted = await Booking.findOne({
      user_id: req.user._id,
      status: 'COMPLETED',
    }).populate({ path: 'court_id', match: { cluster_id } });

    // if (!hasCompleted) return res.status(403).json({ message: 'Bạn chưa hoàn thành đơn nào tại đây' });

    const review = await Review.create({
      user_id: req.user._id,
      cluster_id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/users/favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Lọc bỏ các favorite bị null (do venue đã bị xóa)
    const validFavorites = user.favorites.filter(f => f != null);

    // Populate ratings for each favorite
    const results = await Promise.all(validFavorites.map(async (cluster) => {
      const clusterObj = cluster.toObject();
      const ratingAgg = await Review.aggregate([
        { $match: { cluster_id: cluster._id } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      const rating = ratingAgg[0] || { avg: 0, count: 0 };
      return { ...clusterObj, avg_rating: Number(rating.avg.toFixed(1)), review_count: rating.count };
    }));

    res.status(200).json(results);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/users/favorites
const addFavorite = async (req, res) => {
  try {
    const { venue_id } = req.body;
    if (!venue_id) return res.status(400).json({ message: 'Thiếu venue_id' });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { favorites: venue_id }
    });
    res.status(200).json({ message: 'Đã thêm vào yêu thích' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// DELETE /api/users/favorites/:id
const removeFavorite = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { favorites: req.params.id }
    });
    res.status(200).json({ message: 'Đã xóa khỏi yêu thích' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/users/bookings/:id/payment
const processPayment = async (req, res) => {
  try {
    const { method } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền thanh toán đơn này' });
    }

    booking.payment_method = method;
    
    // Tìm chủ sân để gửi thông báo
    const court = await Court.findById(booking.court_id).populate('cluster_id');
    const ownerId = court.cluster_id.owner_id;

    let notiTitle = 'Đơn đặt sân mới';
    let notiBody = `Bạn có đơn đặt sân mới tại ${court.name}`;

    if (['VNPAY', 'MOMO', 'BANKING', 'TRANSFER'].includes(method)) {
      booking.payment_status = 'PAID';
      booking.status = 'CONFIRMED';
      notiTitle = 'Thanh toán mới';
      notiBody = `Đơn đặt sân ${booking._id.toString().slice(-6)} đã được thanh toán online.`;
    } else {
      // Thanh toán tại sân (CASH) -> Tính là treo nợ (payment_status: PENDING)
      booking.payment_status = 'PENDING';
      booking.payment_method = 'CASH';
      booking.status = 'CONFIRMED'; // Tự động duyệt đơn theo yêu cầu
      notiTitle = 'Đặt sân thanh toán tại chỗ';
      notiBody = `Người dùng đặt sân và sẽ thanh toán ${booking.total_price.toLocaleString('vi-VN')}đ tại sân.`;
    }

    await booking.save();

    // Tạo thông báo cho chủ sân
    await Notification.create({
      user_id: ownerId,
      actor_id: req.user._id,
      type: method === 'CASH' ? 'NEW_BOOKING_CASH' : 'NEW_BOOKING_PAID',
      title: notiTitle,
      body: notiBody,
      payload: { booking_id: booking._id }
    });

    res.status(200).json({ message: 'Cập nhật thanh toán thành công', booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { 
  getMe, updateMe, createBooking, getMyBookings, getBookingById, 
  cancelBooking, createReview, getFavorites, addFavorite, removeFavorite,
  processPayment
};
