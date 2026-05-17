const User = require('../models/User');
const VenueCluster = require('../models/VenueCluster');
const Court = require('../models/Court');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');
const PricingRule = require('../models/PricingRule');
const Notification = require('../models/Notification');
const { sendZaloNotification } = require('../utils/zaloService');

// GET /api/owner/dashboard?range=today|week
const getOwnerDashboard = async (req, res) => {
  try {
    const { range = 'today' } = req.query;
    const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
    const clusterIds = myClusters.map(c => c._id);
    const courts = await Court.find({ cluster_id: { $in: clusterIds } }).select('_id');
    const courtIds = courts.map(c => c._id);

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    
    let queryDate = { $gte: today };
    if (range === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      queryDate = { $gte: weekAgo, $lte: new Date(now.setHours(23, 59, 59, 999)) };
    } else {
      // Mặc định là TODAY (trong khoảng 00:00 đến 23:59 của booking_date)
      queryDate = { 
        $gte: today, 
        $lte: new Date(new Date(today).setHours(23, 59, 59, 999)) 
      };
    }

    const bookings = await Booking.find({
      court_id: { $in: courtIds },
      booking_date: queryDate,
      status: { $ne: 'CANCELLED' }
    });

    // 1. Tổng doanh thu gộp (Tất cả đơn đã PAID)
    const total_revenue = bookings
      .filter(b => b.payment_status === 'PAID')
      .reduce((sum, b) => sum + b.total_price, 0);

    // 2. Tổng phí sàn (5%)
    const total_platform_fee = bookings
      .filter(b => b.payment_status === 'PAID')
      .reduce((sum, b) => sum + b.platform_fee, 0);

    // 3. Doanh thu thực nhận
    const net_revenue = total_revenue - total_platform_fee;

    // 4. Chuyển khoản (PAID qua các kênh online/banking)
    const digital_revenue = bookings
      .filter(b => b.payment_status === 'PAID' && b.payment_method !== 'CASH')
      .reduce((sum, b) => sum + b.total_price, 0);

    // 5. Tiền mặt (Đã thu: PAID + CASH)
    const cash_revenue = bookings
      .filter(b => b.payment_status === 'PAID' && b.payment_method === 'CASH')
      .reduce((sum, b) => sum + b.total_price, 0);

    // 6. Treo nợ (Chưa thu: PENDING + CASH)
    const debt = bookings
      .filter(b => b.payment_status === 'PENDING' && b.payment_method === 'CASH' && (b.status === 'CONFIRMED' || b.status === 'COMPLETED'))
      .reduce((sum, b) => sum + b.total_price, 0);

    // 7. Công nợ hoa hồng hiện tại (Lấy từ User model)
    const currentUser = await User.findById(req.user._id).select('commission_debt');

    res.status(200).json({ 
      total_revenue,
      total_platform_fee,
      net_revenue,
      digital_revenue,
      cash_revenue,
      debt,
      commission_debt: currentUser.commission_debt,
      booking_count: bookings.length
    });
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

// GET /api/owner/venues
const getOwnerVenues = async (req, res) => {
  try {
    const venues = await VenueCluster.find({ owner_id: req.user._id });
    res.status(200).json(venues);
  } catch (error) { res.status(500).json({ message: error.message }); }
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
// POST /api/owner/courts
const createCourt = async (req, res) => {
  try {
    let { name, cluster_id, new_cluster_name, sport_type_id, description, status, image_url } = req.body;
    
    // Nếu chọn tạo cụm sân mới
    if (cluster_id === 'NEW' && new_cluster_name) {
      const slug = new_cluster_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const newCluster = await VenueCluster.create({
        owner_id: req.user._id,
        name: new_cluster_name,
        slug: slug
      });
      cluster_id = newCluster._id.toString();
    } else {
      // Kiểm tra cluster_id thuộc quyền sở hữu của owner
      const cluster = await VenueCluster.findOne({ _id: cluster_id, owner_id: req.user._id });
      if (!cluster) {
        return res.status(403).json({ message: 'Không có quyền tạo sân cho cụm sân này' });
      }
    }

    const court = await Court.create({
      name, cluster_id, sport_type_id, description, status, image_url
    });

    res.status(201).json(court);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// PUT /api/owner/courts/:id
const updateCourt = async (req, res) => {
  try {
    const { name, cluster_id, sport_type_id, description, status, image_url } = req.body;
    
    const court = await Court.findById(req.params.id).populate('cluster_id');
    if (!court || court.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Không tìm thấy sân hoặc không có quyền' });
    }

    if (cluster_id && cluster_id !== court.cluster_id._id.toString()) {
      const newCluster = await VenueCluster.findOne({ _id: cluster_id, owner_id: req.user._id });
      if (!newCluster) {
        return res.status(403).json({ message: 'Cụm sân mới không thuộc quyền sở hữu của bạn' });
      }
      court.cluster_id = cluster_id;
    }

    if (name) court.name = name;
    if (sport_type_id) court.sport_type_id = sport_type_id;
    if (description !== undefined) court.description = description;
    if (status) court.status = status;
    if (image_url !== undefined) court.image_url = image_url;

    await court.save();
    res.status(200).json(court);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// POST /api/owner/pricing-rules
const createPricingRule = async (req, res) => {
  try {
    const { court_id, day_type, slot_start, slot_end, price_per_slot, label, priority } = req.body;
    
    // Hỗ trợ tạo hàng loạt (batch create) nếu court_id là mảng
    const courtIds = Array.isArray(court_id) ? court_id : [court_id];
    
    if (courtIds.length === 0) return res.status(400).json({ message: 'Thiếu court_id' });

    const results = [];
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7);
    const endDateStr = endDate.toISOString().split('T')[0];
    const startDateStr = now.toISOString().split('T')[0];

    for (const cid of courtIds) {
      const court = await Court.findById(cid).populate('cluster_id');
      if (!court || court.cluster_id.owner_id.toString() !== req.user._id.toString()) {
        continue;
      }
      const rule = await PricingRule.create({ court_id: cid, day_type, slot_start, slot_end, price_per_slot, label, priority });
      results.push(rule);
      
      // Trigger generate ngay lập tức
      await generateSlotsForCourt(cid, startDateStr, endDateStr);
    }

    res.status(201).json(results);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// PUT /api/owner/pricing-rules/:id
const updatePricingRule = async (req, res) => {
  try {
    const { day_type, slot_start, slot_end, price_per_slot, label, priority } = req.body;
    const rule = await PricingRule.findById(req.params.id).populate({
      path: 'court_id',
      populate: { path: 'cluster_id' }
    });

    if (!rule) return res.status(404).json({ message: 'Không tìm thấy quy tắc giá' });
    if (rule.court_id.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa quy tắc này' });
    }

    Object.assign(rule, { day_type, slot_start, slot_end, price_per_slot, label, priority });
    await rule.save();

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7);
    await generateSlotsForCourt(rule.court_id._id, now.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);

    res.status(200).json(rule);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// POST /api/owner/pricing-rules/bulk
const bulkCreatePricingRules = async (req, res) => {
  try {
    const { court_ids, rules } = req.body;
    if (!court_ids?.length || !rules?.length) {
      return res.status(400).json({ message: 'Thiếu danh sách sân hoặc danh sách quy tắc' });
    }

    const createdRules = [];
    for (const cid of court_ids) {
      const court = await Court.findById(cid).populate('cluster_id');
      if (!court || court.cluster_id.owner_id.toString() !== req.user._id.toString()) continue;

      for (const ruleData of rules) {
        const rule = await PricingRule.create({
          court_id: cid,
          day_type: ruleData.day_type,
          slot_start: ruleData.slot_start,
          slot_end: ruleData.slot_end,
          price_per_slot: ruleData.price_per_slot,
          label: ruleData.label,
          priority: ruleData.priority
        });
        createdRules.push(rule);
      }
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7);
    const endDateStr = endDate.toISOString().split('T')[0];
    const startDateStr = now.toISOString().split('T')[0];

    for (const cid of court_ids) {
      await generateSlotsForCourt(cid, startDateStr, endDateStr);
    }

    res.status(201).json({ message: `Đã tạo ${createdRules.length} quy tắc thành công`, count: createdRules.length });
  } catch (error) { res.status(500).json({ message: error.message }); }
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

// POST /api/owner/time-slots/unblock
const unblockSlots = async (req, res) => {
  try {
    const { time_slot_ids } = req.body;
    if (!time_slot_ids?.length) return res.status(400).json({ message: 'Thiếu danh sách slot' });

    // Xác thực quyền sở hữu cho TẤT CẢ các slots
    const slotsToUnblock = await TimeSlot.find({ _id: { $in: time_slot_ids } })
      .populate({
        path: 'court_id',
        populate: { path: 'cluster_id', select: 'owner_id' }
      });

    const isAllOwnedByMe = slotsToUnblock.every(s => 
      s.court_id?.cluster_id?.owner_id?.toString() === req.user._id.toString()
    );

    if (!isAllOwnedByMe || slotsToUnblock.length === 0) {
      return res.status(403).json({ message: 'Bạn không có quyền mở khóa một hoặc nhiều slot trong danh sách này' });
    }

    await TimeSlot.updateMany(
      { _id: { $in: time_slot_ids }, status: 'BLOCKED' },
      { status: 'AVAILABLE', blocked_by: null, block_reason: null }
    );

    res.status(200).json({ message: `Đã mở khóa ${time_slot_ids.length} slot thành công` });
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

    const matchStage = { 
      court_id: { $in: courts.map(c => c._id) },
      status: { $ne: 'CANCELLED' } 
    };
    
    if (month && year) {
      const from = new Date(year, month - 1, 1);
      const to = new Date(year, month, 1);
      matchStage.booking_date = { $gte: from, $lt: to };
    }

    const report = await Booking.aggregate([
      { $match: matchStage },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$booking_date' } },
        daily_revenue: { $sum: { $cond: [{ $eq: ["$payment_status", "PAID"] }, "$total_price", 0] } },
        daily_fee: { $sum: { $cond: [{ $eq: ["$payment_status", "PAID"] }, "$platform_fee", 0] } },
        daily_debt: { $sum: { $cond: [
          { $and: [
            { $eq: ["$payment_status", "PENDING"] },
            { $in: ["$status", ["CONFIRMED", "COMPLETED"]] }
          ]}, 
          "$total_price", 
          0
        ] } },
        booking_count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } }
    ]);

    const totalRevenue = report.reduce((sum, r) => sum + r.daily_revenue, 0);
    const totalFee = report.reduce((sum, r) => sum + r.daily_fee, 0);
    const totalDebt = report.reduce((sum, r) => sum + r.daily_debt, 0);
    
    res.status(200).json({ 
      total_revenue: totalRevenue, 
      total_platform_fee: totalFee,
      net_revenue: totalRevenue - totalFee,
      total_debt: totalDebt,
      daily: report 
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/owner/bookings/:id/confirm-payment
const confirmBookingPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('court_id')
      .populate('user_id', 'name phone');

    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });

    // Kiểm tra quyền sở hữu
    const court = await Court.findById(booking.court_id._id).populate('cluster_id');
    if (court.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền xử lý đơn này' });
    }

    if (booking.payment_status === 'PAID') {
      return res.status(400).json({ message: 'Đơn này đã được thanh toán rồi' });
    }

    booking.payment_status = 'PAID';
    if (booking.status === 'PENDING') booking.status = 'CONFIRMED';
    
    // Cập nhật công nợ hoa hồng cho chủ sân
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { commission_debt: booking.platform_fee }
    });

    await booking.save();

    // 1. Tạo thông báo trong DB cho User
    await Notification.create({
      user_id: booking.user_id._id,
      title: 'Thanh toán thành công',
      body: `Đơn đặt sân ${booking.court_id.name} ngày ${new Date(booking.booking_date).toLocaleDateString()} đã được xác nhận.`,
      type: 'BOOKING_CONFIRMED',
      payload: { booking_id: booking._id }
    });

    // 2. Bắn Socket.io thông báo cho User (nếu đang online)
    const io = req.app.get('io');
    if (io) {
      io.to(booking.user_id._id.toString()).emit('new_notification', {
        title: 'Thanh toán thành công',
        message: `Đơn đặt sân ${booking.court_id.name} đã được chủ sân xác nhận.`
      });
    }

    // 3. Thông báo qua Zalo (Gửi cho Khách hàng)
    if (booking.user_id?.phone) {
      sendZaloNotification(booking.user_id.phone, {
        text: `[KINETIC] Đơn đặt sân ${booking.court_id.name} của bạn đã được chủ sân xác nhận thanh toán thành công. Hẹn gặp bạn tại sân!`
      }).catch(err => console.error('[Zalo Notify User Error]', err));
    }

    res.status(200).json({ message: 'Xác nhận thanh toán thành công', booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/owner/customers
const getOwnerCustomers = async (req, res) => {
  try {
    const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
    const courts = await Court.find({ cluster_id: { $in: myClusters.map(c => c._id) } }).select('_id');
    const courtIds = courts.map(c => c._id);

    const bookings = await Booking.find({ court_id: { $in: courtIds } })
      .populate('user_id', 'name email phone created_at');
    
    const customerMap = {};
    bookings.forEach(b => {
      if (b.user_id) {
        const userIdStr = b.user_id._id.toString();
        if (!customerMap[userIdStr]) {
          customerMap[userIdStr] = {
            user: b.user_id,
            booking_count: 1,
            total_spent: b.subtotal
          };
        } else {
          customerMap[userIdStr].booking_count += 1;
          customerMap[userIdStr].total_spent += b.subtotal;
        }
      }
    });

    const customers = Object.values(customerMap);
    res.status(200).json(customers);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/owner/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const booking = await Booking.findById(req.params.id).populate('court_id').populate('user_id', 'name phone');
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });

    // Kiểm tra quyền sở hữu
    const court = await Court.findById(booking.court_id._id).populate('cluster_id');
    if (court.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền xử lý đơn này' });
    }

    booking.status = status;
    
    // TỰ ĐỘNG DUYỆT TIỀN: Nếu là chuyển khoản mà được xác nhận -> Coi như đã nhận tiền
    if (status === 'CONFIRMED' && booking.payment_method === 'BANKING') {
      booking.payment_status = 'PAID';
    }

    let notiTitle = 'Trạng thái đơn đặt sân';
    let notiContent = `Đơn đặt sân của bạn đã chuyển sang trạng thái: ${status === 'CONFIRMED' ? 'Đã xác nhận' : status === 'CANCELLED' ? 'Đã hủy' : status}.`;

    if (status === 'CANCELLED') {
      booking.cancelled_at = new Date();
      // Nhả slot nếu hủy
      const slotIds = booking.booked_slots.map(s => s.time_slot_id);
      await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });
      notiTitle = 'Đơn đặt sân đã bị hủy';
    } else if (status === 'CONFIRMED') {
      notiTitle = 'Đơn đặt sân đã được xác nhận';
    }
    
    // Nếu tự động duyệt tiền, cập nhật công nợ
    if (booking.isModified('payment_status') && booking.payment_status === 'PAID') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { commission_debt: booking.platform_fee }
      });
    }

    await booking.save();

    // Thông báo cho User qua Zalo
    if (booking.user_id?.phone) {
      let zaloText = `[KINETIC] Đơn đặt sân ${booking._id.toString().slice(-6)} của bạn đã chuyển sang trạng thái: ${status === 'CONFIRMED' ? 'Đã xác nhận' : status === 'CANCELLED' ? 'Đã hủy' : status}.`;
      if (status === 'CONFIRMED') zaloText += ' Hẹn gặp bạn tại sân!';
      
      sendZaloNotification(booking.user_id.phone, { text: zaloText })
        .catch(err => console.error('[Zalo Notify User Error]', err));
    }
    await Notification.create({
      user_id: booking.user_id,
      title: notiTitle,
      body: notiContent,
      type: `BOOKING_${status}`,
      payload: { booking_id: booking._id }
    });

    const io = req.app.get('io');
    if (io) {
      io.to(booking.user_id.toString()).emit('new_notification', {
        title: notiTitle,
        message: notiContent
      });
    }

    res.status(200).json({ message: `Đã cập nhật trạng thái đơn thành ${status}`, booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/owner/pricing-rules
const getPricingRules = async (req, res) => {
  try {
    const myClusters = await VenueCluster.find({ owner_id: req.user._id }).select('_id');
    const courts = await Court.find({ cluster_id: { $in: myClusters.map(c => c._id) } }).select('_id');
    const courtIds = courts.map(c => c._id);

    const rules = await PricingRule.find({ court_id: { $in: courtIds } })
      .populate('court_id', 'name')
      .sort('-created_at');
    res.status(200).json(rules);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// DELETE /api/owner/pricing-rules/:id
const deletePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id).populate({
      path: 'court_id',
      populate: { path: 'cluster_id' }
    });

    if (!rule) return res.status(404).json({ message: 'Không tìm thấy quy tắc giá' });
    
    if (rule.court_id.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa quy tắc này' });
    }

    await PricingRule.findByIdAndDelete(req.params.id);

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + 7);
    await generateSlotsForCourt(rule.court_id._id, now.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);

    res.status(200).json({ message: 'Xóa quy tắc thành công' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const { generateSlotsForCourt } = require('../utils/cronJobs');

// POST /api/owner/time-slots/generate
const generateSlots = async (req, res) => {
  try {
    const { court_id, start_date, end_date } = req.body;
    if (!court_id || !start_date || !end_date) {
      return res.status(400).json({ message: 'Thiếu thông tin generate (court_id, start_date, end_date)' });
    }

    const court = await Court.findById(court_id).populate('cluster_id');
    if (!court || court.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền thao tác trên sân này' });
    }

    await generateSlotsForCourt(court_id, start_date, end_date);

    res.status(201).json({ message: `Đã tạo/cập nhật khung giờ thành công` });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const PaymentConfig = require('../models/PaymentConfig');

// GET /api/owner/payment-config
const getPaymentConfig = async (req, res) => {
  try {
    let config = await PaymentConfig.findOne({ owner_id: req.user._id });
    if (!config) {
      config = await PaymentConfig.create({ owner_id: req.user._id });
    }
    res.status(200).json(config);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/owner/payment-config
const updatePaymentConfig = async (req, res) => {
  try {
    const { vnpay, momo, payos, banking } = req.body;
    const config = await PaymentConfig.findOneAndUpdate(
      { owner_id: req.user._id },
      { vnpay, momo, payos, banking },
      { new: true, upsert: true }
    );
    res.status(200).json(config);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// --- VOUCHER MANAGEMENT ---
const Voucher = require('../models/Voucher');

// POST /api/owner/vouchers
const createVoucher = async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_booking_amount, max_discount_amount, start_date, end_date, usage_limit, target_cluster_id, target_court_id } = req.body;
    const voucher = await Voucher.create({
      owner_id: req.user._id,
      code: code.toUpperCase(),
      discount_type,
      discount_value,
      min_booking_amount,
      max_discount_amount,
      start_date,
      end_date,
      usage_limit,
      target_cluster_id,
      target_court_id
    });
    res.status(201).json(voucher);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// GET /api/owner/vouchers
const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ owner_id: req.user._id }).sort('-created_at');
    res.status(200).json(vouchers);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// DELETE /api/owner/vouchers/:id
const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOneAndDelete({ _id: req.params.id, owner_id: req.user._id });
    if (!voucher) return res.status(404).json({ message: 'Không tìm thấy voucher' });
    res.status(200).json({ message: 'Xóa voucher thành công' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  getOwnerDashboard, getOwnerVenues, updateVenue, getOwnerCourts, createCourt, updateCourt,
  createPricingRule, getOwnerTimeSlots, blockSlots,
  getOwnerBookings, updateBookingStatus, getOwnerReport, getOwnerCustomers,
  generateSlots, getPricingRules, deletePricingRule, confirmBookingPayment,
  updatePricingRule, bulkCreatePricingRules, unblockSlots,
  getPaymentConfig, updatePaymentConfig,
  createVoucher, getVouchers, deleteVoucher
};
