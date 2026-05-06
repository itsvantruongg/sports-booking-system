const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực JWT (access token)
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Không có quyền truy cập, thiếu token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: 'Người dùng không tồn tại' });
    if (user.status === 'BANNED') return res.status(403).json({ message: 'Tài khoản đã bị khóa' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Middleware kiểm tra OWNER bắt buộc đổi mật khẩu lần đầu
const checkMustChangePassword = (req, res, next) => {
  if (req.user.must_change_password) {
    return res.status(403).json({
      message: 'Vui lòng đổi mật khẩu trước khi tiếp tục',
      code: 'MUST_CHANGE_PASSWORD',
    });
  }
  next();
};

module.exports = { protect, checkMustChangePassword };
