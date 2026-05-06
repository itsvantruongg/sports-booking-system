const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const createOwnerAccount = async (name, email) => {
  // 1. Kiểm tra xem email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email này đã được sử dụng!');
  }

  // 2. Tạo mật khẩu ngẫu nhiên (ví dụ: chuỗi hex dài 10 ký tự)
  const randomPassword = crypto.randomBytes(5).toString('hex'); // vd: 'a1b2c3d4e5'

  // 3. Lưu vào Database (Mật khẩu sẽ tự động được băm nhờ logic ở User Model)
  const newOwner = await User.create({
    name,
    email,
    password: randomPassword,
    role: 'OWNER',
    isFirstLogin: true, // Đánh dấu là lần đăng nhập đầu tiên
  });

  // 4. Gửi email chứa thông tin đăng nhập cho Owner
  const messageHtml = `
    <h2>Chào mừng bạn đến với Hệ thống Kinetic Sports!</h2>
    <p>Xin chào <strong>${name}</strong>,</p>
    <p>Tài khoản Đối tác (Chủ sân) của bạn đã được tạo thành công bởi Ban quản trị.</p>
    <p>Dưới đây là thông tin đăng nhập tạm thời của bạn:</p>
    <ul>
      <li><strong>Email đăng nhập:</strong> ${email}</li>
      <li><strong>Mật khẩu tạm thời:</strong> ${randomPassword}</li>
    </ul>
    <p><em>Lưu ý: Vì lý do bảo mật, hệ thống sẽ yêu cầu bạn đổi mật khẩu ngay ở lần đăng nhập đầu tiên.</em></p>
    <p>Cảm ơn bạn đã đồng hành cùng Kinetic!</p>
  `;

  try {
    await sendEmail({
      email: newOwner.email,
      subject: 'Thông tin tài khoản Đối tác Kinetic',
      html: messageHtml,
    });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    // Vẫn trả về thành công nhưng có cảnh báo gửi mail thất bại
    return {
      user: newOwner,
      warning: 'Tạo tài khoản thành công nhưng gửi email thất bại',
      tempPassword: randomPassword // Gửi lại mk lên cho Admin đề phòng lỗi mail
    };
  }

  return {
    user: newOwner,
    message: 'Tạo tài khoản Chủ sân và gửi email thành công',
  };
};

module.exports = {
  createOwnerAccount,
};
