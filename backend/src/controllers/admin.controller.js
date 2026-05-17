const User = require('../models/User');
const VenueCluster = require('../models/VenueCluster');
const Booking = require('../models/Booking');
const SportType = require('../models/SportType');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const [userCount, ownerCount, venueCount, bookingCount, stats, totalDebt] = await Promise.all([
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
      ])
    ]);

    res.status(200).json({
      totalUsers: userCount,
      totalOwners: ownerCount,
      totalVenues: venueCount,
      totalBookings: bookingCount,
      totalRevenue: stats[0]?.total_revenue || 0,
      totalPlatformFee: stats[0]?.platform_fee || 0,
      uncollectedCommission: totalDebt[0]?.total || 0,
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

    user.commission_debt = 0;
    await user.save();

    res.status(200).json({ message: 'Đã thanh toán công nợ thành công', user });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getAdminDashboard, createOwner, getAllUsers, updateUserStatus, getAllVenues, createSportType, updateVenueStatus, clearOwnerDebt };
