const User = require('../models/User');
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Review = require('../models/Review');
const VenueCluster = require('../models/VenueCluster');
const Court = require('../models/Court');
const Notification = require('../models/Notification');
const { sendZaloNotification } = require('../utils/zaloService');

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
    const { court_id, booking_date, time_slot_ids, voucher_code } = req.body;
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

    // 1. Tính tiền gốc
    const subtotal = slots.reduce((sum, s) => sum + s.price, 0);
    
    // 2. Xử lý Voucher (nếu có)
    let discount_amount = 0;
    let appliedVoucher = null;

    if (voucher_code) {
      const Voucher = require('../models/Voucher');
      appliedVoucher = await Voucher.findOne({ 
        code: voucher_code.toUpperCase(), 
        is_active: true,
        start_date: { $lte: now },
        end_date: { $gte: now }
      });

      if (appliedVoucher) {
        if (subtotal >= appliedVoucher.min_booking_amount && appliedVoucher.used_count < appliedVoucher.usage_limit) {
          if (appliedVoucher.discount_type === 'PERCENT') {
            discount_amount = Math.round(subtotal * (appliedVoucher.discount_value / 100));
            if (appliedVoucher.max_discount_amount && discount_amount > appliedVoucher.max_discount_amount) {
              discount_amount = appliedVoucher.max_discount_amount;
            }
          } else {
            discount_amount = appliedVoucher.discount_value;
          }
        }
      }
    }

    // 3. Tính toán tiền cuối cùng & Phí sàn (5%)
    const total_price = Math.max(0, subtotal - discount_amount);
    const platform_fee = Math.round(total_price * 0.05); // 5% phí sàn
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    const booking = await Booking.create({
      user_id: req.user._id,
      court_id,
      booking_date: new Date(booking_date),
      start_time: slots[0].start_time,
      end_time: slots[slots.length - 1].end_time,
      slot_count: slots.length,
      subtotal,
      discount_amount,
      voucher_code: appliedVoucher ? appliedVoucher.code : null,
      platform_fee,
      total_price,
      payment_method: 'TRANSFER', 
      payment_status: 'PENDING',
      status: 'PENDING',
      expires_at,
      booked_slots: slots.map(s => ({ time_slot_id: s._id, slot_price: s.price })),
    });

    // Cập nhật số lần dùng voucher
    if (appliedVoucher) {
      appliedVoucher.used_count += 1;
      await appliedVoucher.save();
    }

    // 4. Thông báo qua Zalo (Gửi cho Chủ sân) - Chỉ là thông báo có người đang quan tâm hoặc khởi tạo (tuy nhu cầu, ở đây ta có thể bỏ qua nếu muốn chỉ báo khi đã trả tiền)
    /* 
    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'court_id',
      populate: { path: 'cluster_id', populate: { path: 'owner_id', select: 'name phone' } }
    });
    
    const owner = populatedBooking?.court_id?.cluster_id?.owner_id;

    if (owner && owner.phone) {
      sendZaloNotification(owner.phone, {
        text: `[KINETIC] Đang có khách khởi tạo đơn đặt sân ${populatedBooking.court_id.name}...`
      }).catch(err => console.error('[Zalo Notify Error]', err));
    }
    */

    // Khóa các slot lại tạm thời
    await TimeSlot.updateMany({ _id: { $in: time_slot_ids } }, { status: 'BOOKED' });

    res.status(201).json({
      booking_id: booking._id,
      total_price,
      discount_amount,
      expires_at,
    });
  } catch (error) { 
    console.error('[Create Booking Error]', error);
    res.status(500).json({ message: error.message }); 
  }
};

// GET /api/users/bookings?status=UPCOMING|COMPLETED
const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user_id: req.user._id };

    if (status === 'UPCOMING') {
      query.$or = [
        { status: 'CONFIRMED' },
        { status: 'PENDING', payment_method: 'BANKING' } // Đang chờ xác nhận chuyển khoản
      ];
    }
    else if (status === 'COMPLETED') query.status = 'COMPLETED';
    else if (status === 'UNPAID') {
      query.status = 'PENDING';
      query.expires_at = { $gt: new Date() };
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'court_id',
        select: 'name cluster_id',
        populate: { 
          path: 'cluster_id', 
          select: 'name address district city owner_id',
          populate: { path: 'owner_id', select: 'name phone' }
        }
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

    console.log(`[UserAPI] User ${req.user._id} has ${user.favorites.length} items in favorites list.`);

    // Lọc bỏ các favorite bị null (do venue đã bị xóa)
    const validFavorites = user.favorites.filter(f => f != null);

    if (user.favorites.length !== validFavorites.length) {
      console.warn(`[UserAPI] Filtered out ${user.favorites.length - validFavorites.length} null favorites (possibly deleted venues).`);
    }

    // Populate ratings for each favorite
    const results = await Promise.all(validFavorites.map(async (cluster) => {
      try {
        const clusterObj = cluster.toObject();
        const ratingAgg = await Review.aggregate([
          { $match: { cluster_id: cluster._id } },
          { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);
        const rating = ratingAgg[0] || { avg: 0, count: 0 };
        return { ...clusterObj, avg_rating: Number(rating.avg.toFixed(1)), review_count: rating.count };
      } catch (err) {
        console.error(`[UserAPI] Error processing favorite cluster ${cluster._id}:`, err);
        return null;
      }
    }));

    const finalResults = results.filter(r => r != null);
    res.status(200).json(finalResults);
  } catch (error) {
    console.error(`[UserAPI] Get favorites failed:`, error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/favorites
const addFavorite = async (req, res) => {
  try {
    const { venue_id } = req.body;
    console.log(`[UserAPI] Adding favorite: User=${req.user._id}, Venue=${venue_id}`);

    if (!venue_id) return res.status(400).json({ message: 'Thiếu venue_id' });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { favorites: venue_id }
    }, { new: true });

    console.log(`[UserAPI] Favorite added successfully. Total favorites: ${updatedUser.favorites.length}`);
    res.status(200).json({ message: 'Đã thêm vào yêu thích' });
  } catch (error) {
    console.error(`[UserAPI] Add favorite failed:`, error);
    res.status(500).json({ message: 'Lỗi hệ thống khi thêm yêu thích: ' + error.message });
  }
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

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Đơn đặt sân này đã bị hủy (có thể do quá thời gian giữ chỗ 5 phút).' });
    }

    // KIỂM TRA LẠI SLOT CÒN TRỐNG KHÔNG (Vì lúc tạo đơn ta khóa slot = BOOKED)
    // Nếu slot là AVAILABLE hoặc BOOKED (do chính đơn này khóa) thì hợp lệ
    const slotIds = booking.booked_slots.map(s => s.time_slot_id);
    const validSlots = await TimeSlot.find({
      _id: { $in: slotIds },
      status: { $in: ['AVAILABLE', 'BOOKED'] }
    });

    if (validSlots.length !== slotIds.length) {
      booking.status = 'CANCELLED';
      booking.cancel_reason = 'Khung giờ đã bị người khác đặt mất trước khi bạn hoàn tất thanh toán';
      await booking.save();
      return res.status(409).json({ message: 'Rất tiếc, một số khung giờ bạn chọn không còn trống. Vui lòng chọn ca khác.' });
    }

    booking.payment_method = method;

    // Tìm chủ sân để gửi thông báo
    const court = await Court.findById(booking.court_id).populate({
      path: 'cluster_id',
      populate: { path: 'owner_id', select: 'name phone email' }
    });
    const owner = court?.cluster_id?.owner_id;
    const ownerId = owner?._id;

    let notiTitle = 'Đơn đặt sân mới';
    let notiBody = `Bạn có đơn đặt sân mới tại ${court?.name || 'sân'}`;

    if (['VNPAY', 'MOMO', 'PAYOS'].includes(method)) {
      booking.payment_status = 'PAID';
      booking.status = 'CONFIRMED';
      notiTitle = 'Thanh toán thành công';
      notiBody = `Đơn đặt sân ${booking._id.toString().slice(-6)} đã được thanh toán online.`;
    } else if (['BANKING', 'TRANSFER'].includes(method)) {
      booking.payment_status = 'PENDING';
      booking.status = 'PENDING'; 
      notiTitle = 'Yêu cầu đặt sân (Chuyển khoản)';
      notiBody = `Khách hàng đã chuyển khoản và đang chờ bạn xác nhận đơn ${booking._id.toString().slice(-6)}.`;
    } else {
      booking.payment_status = 'PENDING';
      booking.payment_method = 'CASH';
      booking.status = 'CONFIRMED'; 
      notiTitle = 'Đơn đặt sân mới (Tiền mặt)';
      notiBody = `Khách hàng ${req.user.name} đã đặt sân và sẽ trả tiền mặt tại chỗ.`;
    }

    // Cập nhật công nợ hoa hồng nếu thanh toán thành công
    if (booking.payment_status === 'PAID' && ownerId) {
      await User.findByIdAndUpdate(ownerId, {
        $inc: { commission_debt: booking.platform_fee }
      });
    }

    booking.expires_at = null;
    await booking.save();

    // Cập nhật trạng thái cho các TimeSlot sang BOOKED nếu đơn được xác nhận
    if (booking.status === 'CONFIRMED') {
      const slotIds = booking.booked_slots.map(s => s.time_slot_id);
      await TimeSlot.updateMany(
        { _id: { $in: slotIds } },
        { $set: { status: 'BOOKED' } }
      );
    }

    // Tạo thông báo cho chủ sân (Bọc trong try-catch để không làm hỏng luồng chính)
    try {
      if (ownerId) {
        await Notification.create({
          user_id: ownerId,
          actor_id: req.user._id,
          type: method === 'CASH' ? 'NEW_BOOKING_CASH' : 'NEW_BOOKING_PAID',
          title: notiTitle,
          body: notiBody,
          payload: { booking_id: booking._id }
        });

        const io = req.app.get('io');
        if (io) {
          io.to(ownerId.toString()).emit('new_notification', {
            title: notiTitle,
            message: notiBody
          });
        }

          // 3. Thông báo qua Zalo (Gửi cho Chủ sân)
          if (owner && owner.phone) {
            sendZaloNotification(owner.phone, {
              text: `[KINETIC] ${notiTitle}: ${notiBody}. Tổng tiền: ${booking.total_price.toLocaleString('vi-VN')}đ.`
            }).catch(err => console.error('[Zalo Notify Owner Error]', err));
          }

          // 4. Thông báo qua Zalo (Gửi cho Khách hàng)
          if (req.user.phone) {
            let userMsg = `[KINETIC] Đơn hàng ${booking._id.toString().slice(-6)} của bạn đã được ghi nhận (${method}).`;
            if (method === 'CASH') userMsg += ' Vui lòng thanh toán tại sân khi đến nhận sân.';
            else if (['BANKING', 'TRANSFER'].includes(method)) userMsg += ' Vui lòng đợi chủ sân xác nhận thanh toán.';
            
            sendZaloNotification(req.user.phone, { text: userMsg })
              .catch(err => console.error('[Zalo Notify User Error]', err));
          }
        }
    } catch (notiError) {
      console.error('[Notification Error] Failed to send notification:', notiError);
    }

    res.status(200).json({ message: 'Cập nhật thanh toán thành công', booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/users/vouchers/venue/:venueId
const getVenueVouchers = async (req, res) => {
  try {
    const Voucher = require('../models/Voucher');
    const { venueId } = req.params;
    const now = new Date();
    
    const venue = await VenueCluster.findById(venueId);
    if (!venue) return res.status(404).json({ message: 'Không tìm thấy sân' });

    const vouchers = await Voucher.find({
      owner_id: venue.owner_id,
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now },
      $expr: { $lt: ["$used_count", "$usage_limit"] }
    }).select('code discount_type discount_value min_booking_amount');

    res.status(200).json(vouchers);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/users/vouchers/validate
const validateVoucher = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const Voucher = require('../models/Voucher');
    const now = new Date();

    const voucher = await Voucher.findOne({
      code: code.toUpperCase(),
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now }
    });

    if (!voucher) return res.status(404).json({ message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    if (voucher.used_count >= voucher.usage_limit) return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    if (subtotal < voucher.min_booking_amount) return res.status(400).json({ 
      message: `Đơn hàng tối thiểu ${voucher.min_booking_amount.toLocaleString()}₫ để áp dụng mã này` 
    });

    let discount_amount = 0;
    if (voucher.discount_type === 'PERCENT') {
      discount_amount = Math.round(subtotal * (voucher.discount_value / 100));
      if (voucher.max_discount_amount && discount_amount > voucher.max_discount_amount) {
        discount_amount = voucher.max_discount_amount;
      }
    } else {
      discount_amount = voucher.discount_value;
    }

    res.status(200).json({
      code: voucher.code,
      discount_amount,
      total_price: Math.max(0, subtotal - discount_amount)
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/users/vouchers/claim
const claimVoucher = async (req, res) => {
  try {
    const { code } = req.body;
    const Voucher = require('../models/Voucher');
    const VoucherClaim = require('../models/VoucherClaim');
    const now = new Date();

    const voucher = await Voucher.findOne({
      code: code.toUpperCase(),
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now }
    });

    if (!voucher) return res.status(404).json({ message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    if (voucher.used_count >= voucher.usage_limit) return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });

    // Kiểm tra xem đã claim chưa
    const existingClaim = await VoucherClaim.findOne({ user_id: req.user._id, voucher_id: voucher._id });
    if (existingClaim) return res.status(400).json({ message: 'Bạn đã lưu mã giảm giá này rồi' });

    await VoucherClaim.create({
      user_id: req.user._id,
      voucher_id: voucher._id
    });

    res.status(201).json({ message: 'Lưu voucher thành công', voucher });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/users/vouchers/my
const getMyVouchers = async (req, res) => {
  try {
    const VoucherClaim = require('../models/VoucherClaim');
    const claims = await VoucherClaim.find({ user_id: req.user._id })
      .populate('voucher_id')
      .sort('-claimed_at');

    // Chỉ trả về các voucher còn hiệu lực
    const now = new Date();
    const activeVouchers = claims
      .map(c => c.voucher_id)
      .filter(v => v && v.is_active && v.end_date >= now);

    res.status(200).json(activeVouchers);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/users/bookings/:id/apply-voucher
const applyVoucherToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { voucher_code } = req.body;
    const Voucher = require('../models/Voucher');
    
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    if (booking.user_id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Không có quyền' });
    if (booking.payment_status === 'PAID') return res.status(400).json({ message: 'Đơn hàng đã thanh toán' });

    // Handle removing voucher
    if (!voucher_code) {
      if (booking.voucher_code) {
        const oldVoucher = await Voucher.findOne({ code: booking.voucher_code });
        if (oldVoucher) {
          oldVoucher.used_count = Math.max(0, oldVoucher.used_count - 1);
          await oldVoucher.save();
        }
        booking.voucher_code = null;
        booking.discount_amount = 0;
        booking.total_price = booking.subtotal;
        booking.platform_fee = Math.round(booking.total_price * 0.05);
        await booking.save();
      }
      return res.status(200).json({ message: 'Đã gỡ mã giảm giá', booking });
    }

    // If changing to a new voucher, decrease used count of old one first
    if (booking.voucher_code && booking.voucher_code.toUpperCase() !== voucher_code.toUpperCase()) {
       const oldVoucher = await Voucher.findOne({ code: booking.voucher_code });
       if (oldVoucher) {
         oldVoucher.used_count = Math.max(0, oldVoucher.used_count - 1);
         await oldVoucher.save();
       }
    }

    const now = new Date();
    const voucher = await Voucher.findOne({
      code: voucher_code.toUpperCase(),
      is_active: true,
      start_date: { $lte: now },
      end_date: { $gte: now }
    });

    if (!voucher) return res.status(404).json({ message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
    if (voucher.used_count >= voucher.usage_limit && booking.voucher_code?.toUpperCase() !== voucher_code.toUpperCase()) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }
    
    const subtotal = booking.subtotal; 
    if (subtotal < voucher.min_booking_amount) {
      return res.status(400).json({ message: `Đơn tối thiểu ${voucher.min_booking_amount.toLocaleString()}₫` });
    }

    let discount_amount = 0;
    if (voucher.discount_type === 'PERCENT') {
      discount_amount = Math.round(subtotal * (voucher.discount_value / 100));
      if (voucher.max_discount_amount && discount_amount > voucher.max_discount_amount) {
        discount_amount = voucher.max_discount_amount;
      }
    } else {
      discount_amount = voucher.discount_value;
    }

    if (!booking.voucher_code || booking.voucher_code.toUpperCase() !== voucher.code.toUpperCase()) {
        voucher.used_count += 1;
        await voucher.save();
    }

    booking.voucher_code = voucher.code;
    booking.discount_amount = discount_amount;
    booking.total_price = Math.max(0, subtotal - discount_amount);
    booking.platform_fee = Math.round(booking.total_price * 0.05);
    
    await booking.save();
    
    res.status(200).json({ message: 'Áp dụng mã thành công', booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  getMe, updateMe, createBooking, getMyBookings, getBookingById,
  cancelBooking, createReview, getFavorites, addFavorite, removeFavorite,
  processPayment, getVenueVouchers, validateVoucher,
  claimVoucher, getMyVouchers, applyVoucherToBooking
};
