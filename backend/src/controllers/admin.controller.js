const User = require('../models/User');
const VenueCluster = require('../models/VenueCluster');
const Booking = require('../models/Booking');
const SportType = require('../models/SportType');
const Court = require('../models/Court');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Helper to dynamically calculate owner commission debt and paid balances from bookings
const syncCommissions = async () => {
  try {
    const owners = await User.find({ role: 'OWNER' });
    for (const owner of owners) {
      const clusters = await VenueCluster.find({ owner_id: owner._id });
      const clusterIds = clusters.map(c => c._id);
      const courts = await Court.find({ cluster_id: { $in: clusterIds } });
      const courtIds = courts.map(c => c._id);

      const bookings = await Booking.find({
        court_id: { $in: courtIds },
        payment_status: 'PAID',
        status: { $ne: 'CANCELLED' }
      });

      let calculatedDebt = 0;
      let calculatedPaid = 0;

      for (const b of bookings) {
        const isOnline = ['VNPAY', 'MOMO', 'PAYOS'].includes(b.payment_method);
        const fee = b.platform_fee || 0;
        
        if (isOnline) {
          calculatedPaid += fee;
        } else {
          if (b.commission_status === 'PAID') {
            calculatedPaid += fee;
          } else {
            calculatedDebt += fee;
          }
        }
      }

      owner.commission_debt = calculatedDebt;
      owner.commission_paid = calculatedPaid;
      await owner.save();
    }
  } catch (error) {
    console.error('Error syncing commissions:', error);
  }
};

// GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    await syncCommissions();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [userCount, ownerCount, venueCount, bookingCount, stats, totalDebt, dbMonthly] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'OWNER' }),
      VenueCluster.countDocuments({ status: 'ACTIVE' }),
      Booking.countDocuments({ status: { $ne: 'CANCELLED' } }),
      Booking.aggregate([
        { $match: { payment_status: 'PAID', status: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total_revenue: { $sum: '$total_price' }, platform_fee: { $sum: '$platform_fee' } } }
      ]),
      User.aggregate([
        { $match: { role: 'OWNER' } },
        { $group: { _id: null, total: { $sum: '$commission_debt' } } }
      ]),
      Booking.aggregate([
        { 
          $match: { 
            payment_status: 'PAID', 
            status: { $ne: 'CANCELLED' },
            booking_date: { $gte: sixMonthsAgo }
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$booking_date' },
              month: { $month: '$booking_date' }
            },
            revenue: { $sum: '$total_price' },
            fee: { $sum: '$platform_fee' }
          }
        }
      ])
    ]);

    // Build exactly the past 6 months chronologically
    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed
      monthlyBreakdown.push({
        year,
        month,
        monthLabel: `Tháng ${month}`,
        revenue: 0,
        fee: 0
      });
    }

    // Merge DB results into breakdown
    dbMonthly.forEach(item => {
      const match = monthlyBreakdown.find(m => m.year === item._id.year && m.month === item._id.month);
      if (match) {
        match.revenue = item.revenue;
        match.fee = item.fee;
      }
    });

    res.status(200).json({
      totalUsers: userCount,
      totalOwners: ownerCount,
      totalVenues: venueCount,
      totalBookings: bookingCount,
      totalRevenue: stats[0]?.total_revenue || 0,
      totalPlatformFee: stats[0]?.platform_fee || 0,
      uncollectedCommission: totalDebt[0]?.total || 0,
      monthlyBreakdown,
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/admin/owners — Tạo tài khoản chủ sân
const createOwner = async (req, res) => {
  try {
    const { name, email, phone, venue_name } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email đã tồn tại' });

    // Sinh mật khẩu tạm ngẫu nhiên
    const tempPassword = crypto.randomBytes(5).toString('hex');
    const owner = await User.create({
      name, email, phone, password: tempPassword,
      role: 'OWNER', must_change_password: true,
    });

    // Gửi email chào mừng kèm thông tin đăng nhập
    sendEmail({
      to: email,
      subject: `[KINETIC] Tài khoản đối tác của bạn đã sẵn sàng`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #003ec7;">Chào mừng đối tác mới!</h2>
          <p>Chào <strong>${name}</strong>,</p>
          <p>Tài khoản quản lý sân của bạn trên hệ thống KINETIC đã được khởi tạo thành công.</p>
          <div style="background-color: #f3f2ff; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email đăng nhập:</strong> ${email}</p>
            <p style="margin: 5px 0 0 0;"><strong>Mật khẩu tạm thời:</strong> <span style="color: #003ec7; font-size: 1.2em; font-weight: bold;">${tempPassword}</span></p>
          </div>
          <p>Vì lý do bảo mật, bạn sẽ được yêu cầu <strong>thay đổi mật khẩu</strong> ngay trong lần đăng nhập đầu tiên.</p>
          <a href="http://localhost:3000/login" style="display: inline-block; background-color: #003ec7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Đăng nhập ngay</a>
          <p style="margin-top: 30px; font-size: 0.8em; color: #666;">Trân trọng,<br />Đội ngũ KINETIC Platform</p>
        </div>
      `,
    }).catch(err => console.error('[Email Error]', err));

    res.status(201).json({
      message: 'Tạo tài khoản Owner thành công',
      new_owner_id: owner._id,
      temp_password: tempPassword, // chỉ hiển thị khi email fail
    });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// GET /api/admin/users?role=...&search=...
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    if (role === 'OWNER') {
      await syncCommissions();
    }
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(Number(limit)).select('-refresh_token'),
      User.countDocuments(query),
    ]);
    res.status(200).json({ total, page: Number(page), data: users });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'BANNED'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ (ACTIVE | BANNED)' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json({ message: `Đã cập nhật trạng thái user thành ${status}`, user });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// GET /api/admin/venues?status=...
const getAllVenues = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [venues, total] = await Promise.all([
      VenueCluster.find(query).skip(skip).limit(Number(limit)).populate('owner_id', 'name email'),
      VenueCluster.countDocuments(query),
    ]);
    res.status(200).json({ total, page: Number(page), data: venues });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// POST /api/admin/sport-types
const createSportType = async (req, res) => {
  try {
    const { name, slug, icon_url } = req.body;
    const sport = await SportType.create({ name, slug, icon_url });
    res.status(201).json(sport);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// PUT /api/admin/venues/:id/status
const updateVenueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['ACTIVE', 'INACTIVE', 'BANNED'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }
    const venue = await VenueCluster.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!venue) return res.status(404).json({ message: 'Không tìm thấy cụm sân' });
    res.status(200).json({ message: `Đã cập nhật trạng thái cụm sân thành ${status}`, venue });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const clearOwnerDebt = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'OWNER') {
      return res.status(404).json({ message: 'Không tìm thấy chủ sân' });
    }

    // Update all offline bookings to mark their commission as PAID in DB
    const clusters = await VenueCluster.find({ owner_id: user._id });
    const clusterIds = clusters.map(c => c._id);
    const courts = await Court.find({ cluster_id: { $in: clusterIds } });
    const courtIds = courts.map(c => c._id);

    await Booking.updateMany(
      {
        court_id: { $in: courtIds },
        payment_status: 'PAID',
        payment_method: { $nin: ['VNPAY', 'MOMO', 'PAYOS'] },
        commission_status: 'UNPAID'
      },
      { commission_status: 'PAID' }
    );

    // Sync to cleanly recalculate everything
    await syncCommissions();

    const updatedUser = await User.findById(req.params.id);

    res.status(200).json({ message: 'Đã thanh toán công nợ thành công', user: updatedUser });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const seedCommission = async (req, res) => {
  try {
    // 1. Delete all existing mock bookings to avoid duplicates
    await Booking.deleteMany({ voucher_code: 'MOCKDATA' });

    const owners = await User.find({ role: 'OWNER' });
    
    // For each owner, find or create cluster and court, then seed matching bookings
    for (const owner of owners) {
      let cluster = await VenueCluster.findOne({ owner_id: owner._id });
      if (!cluster) {
        cluster = await VenueCluster.create({
          owner_id: owner._id,
          name: `Sân bóng của ${owner.name}`,
          slug: `san-bong-cua-${owner._id}`,
          address: '123 Đường Láng',
          city: 'Hà Nội',
          status: 'ACTIVE'
        });
      }
      
      let court = await Court.findOne({ cluster_id: cluster._id });
      if (!court) {
        let sport = await SportType.findOne({});
        if (!sport) {
          sport = await SportType.create({ name: 'Pickleball', slug: 'pickleball' });
        }
        court = await Court.create({
          cluster_id: cluster._id,
          sport_type_id: sport._id,
          name: 'Sân 1',
          status: 'ACTIVE'
        });
      }

      // Configure targets
      let debtTarget = 450000;
      let paidTarget = 1000000;
      if (owner.email === 'owner@test.com') {
        debtTarget = 750000;
        paidTarget = 2500000;
      } else if (owner.email === 'test01@gmail.com') {
        debtTarget = 350000;
        paidTarget = 1200000;
      } else if (owner.email === 'test02@gmail.com') {
        debtTarget = 500000;
        paidTarget = 1800000;
      }

      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        // Seed in the middle of each month
        date.setDate(15);
        date.setHours(12, 0, 0, 0);

        const trendMultiplier = [0.5, 0.6, 0.8, 0.7, 0.9, 1.0][i];
        const monthlyDebtTarget = Math.round(debtTarget * trendMultiplier);
        const monthlyPaidTarget = Math.round(paidTarget * trendMultiplier);

        // Create CASH booking that is UNPAID (represents debt)
        await Booking.create({
          user_id: owner._id,
          court_id: court._id,
          booking_date: date,
          start_time: '08:00',
          end_time: '09:00',
          slot_count: 1,
          subtotal: monthlyDebtTarget * 20,
          platform_fee: monthlyDebtTarget,
          total_price: monthlyDebtTarget * 20,
          payment_method: 'CASH',
          payment_status: 'PAID',
          commission_status: 'UNPAID',
          status: 'CONFIRMED',
          voucher_code: 'MOCKDATA'
        });

        // Create VNPAY booking that is PAID (represents paid commission)
        await Booking.create({
          user_id: owner._id,
          court_id: court._id,
          booking_date: date,
          start_time: '10:00',
          end_time: '11:00',
          slot_count: 1,
          subtotal: monthlyPaidTarget * 20,
          platform_fee: monthlyPaidTarget,
          total_price: monthlyPaidTarget * 20,
          payment_method: 'VNPAY',
          payment_status: 'PAID',
          commission_status: 'PAID',
          status: 'CONFIRMED',
          voucher_code: 'MOCKDATA'
        });
      }
    }

    // Now run syncCommissions to cleanly compute and cache everything in the DB
    await syncCommissions();

    res.status(200).json({ 
      message: 'Đã tạo dữ liệu công nợ, số tiền đã nộp và biểu đồ thực tế thành công!', 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cleanCommission = async (req, res) => {
  try {
    // 1. Delete all existing mock bookings
    await Booking.deleteMany({ voucher_code: 'MOCKDATA' });

    // 2. Sync to cleanly recalculate everything based on remaining real bookings
    await syncCommissions();

    res.status(200).json({ 
      message: 'Đã xóa toàn bộ dữ liệu mẫu thành công!', 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAdminDashboard, 
  createOwner, 
  getAllUsers, 
  updateUserStatus, 
  getAllVenues, 
  createSportType, 
  updateVenueStatus, 
  clearOwnerDebt, 
  seedCommission,
  cleanCommission
};
