const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hàm tạo Token (Ký bằng Secret Key)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const loginUser = async (email, password) => {
  // 1. Kiểm tra xem user có tồn tại không (lấy cả password bị ẩn)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Email không tồn tại');
  }

  // 2. So sánh mật khẩu
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    throw new Error('Mật khẩu không chính xác');
  }

  // 3. Xoá trường password trước khi trả về kết quả
  user.password = undefined;

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isFirstLogin: user.isFirstLogin,
    token: generateToken(user._id),
  };
};

const forceChangePassword = async (userId, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User không tồn tại');
  }

  if (!user.isFirstLogin) {
    throw new Error('Tài khoản này đã đổi mật khẩu, không thể thực hiện lại');
  }

  user.password = newPassword;
  user.isFirstLogin = false;
  await user.save();

  return { message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' };
};

module.exports = {
  loginUser,
  forceChangePassword,
};

