const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Tạo access token ngắn hạn (15 phút)
const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '24h' });

// Tạo refresh token dài hạn (7 ngày)
const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

// ─── ĐĂNG KÝ ────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email đã được sử dụng' });

    const user = await User.create({ name, email, phone, password, role: 'USER' });
    res.status(201).json({ message: 'Đăng ký thành công', user_id: user._id });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

// ─── ĐĂNG NHẬP ──────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    if (user.status === 'BANNED') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Lưu refresh token vào DB để có thể revoke
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Gửi refresh token qua HttpOnly Cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.status(200).json({
      access_token: accessToken,
      role: user.role,
      must_change_password: user.must_change_password,
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ─── LÀM MỚI ACCESS TOKEN ────────────────────────────────────
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: 'Không tìm thấy refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refresh_token');
    if (!user || user.refresh_token !== token) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã bị thu hồi' });
    }

    const accessToken = generateAccessToken(user._id);
    res.status(200).json({ access_token: accessToken });
  } catch (error) { res.status(401).json({ message: 'Refresh token hết hạn, vui lòng đăng nhập lại' }); }
};

// ─── ĐỔI MẬT KHẨU LẦN ĐẦU (OWNER) ─────────────────────────
const forceChangePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(old_password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    if (new_password.length < 8) return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 8 ký tự' });

    user.password = new_password;
    user.must_change_password = false;
    await user.save();

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { register, login, refresh, forceChangePassword };
