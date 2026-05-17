const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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

// ─── QUÊN MẬT KHẨU ───────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });
    }

    // Tạo mã token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token và lưu vào DB (bảo mật hơn lưu text thuần)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token hết hạn sau 15 phút
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Tạo URL reset password
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const message = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px;">
        <h2 style="color: #003ec7; text-align: center;">Đặt lại mật khẩu của bạn</h2>
        <p>Chào bạn,</p>
        <p>Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại mật khẩu. <b>Đường dẫn này chỉ có hiệu lực trong 15 phút.</b></p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #003ec7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">ĐẶT LẠI MẬT KHẨU</a>
        </div>
        <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">Trân trọng,<br>Đội ngũ Kinetic</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'KINETIC - Yêu cầu đặt lại mật khẩu',
        html: message,
      });

      res.status(200).json({ message: 'Email đặt lại mật khẩu đã được gửi' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Không thể gửi email. Vui lòng thử lại sau.' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ─── ĐẶT LẠI MẬT KHẨU ────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hash token từ URL để so sánh với bản lưu trong DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
    }

    // Thiết lập mật khẩu mới
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { register, login, refresh, forceChangePassword, forgotPassword, resetPassword };
