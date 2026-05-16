const Partnership = require('../models/Partnership');
const sendEmail = require('../utils/sendEmail');

// POST /api/partnerships
const submitPartnership = async (req, res) => {
  try {
    const { name, phone, fieldName, email, message } = req.body;

    // 1. Lưu vào Database
    const newRequest = await Partnership.create({
      name,
      phone,
      fieldName,
      email,
      message
    });

    // 2. Gửi Email thông báo cho Admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const emailOptions = {
      to: adminEmail,
      subject: `[KINETIC] Yêu cầu hợp tác mới từ ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #003ec7;">Yêu cầu hợp tác mới</h2>
          <p>Hệ thống KINETIC vừa nhận được một yêu cầu hợp tác mới từ trang web.</p>
          <hr />
          <p><strong>Họ và tên:</strong> ${name}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Tên sân:</strong> ${fieldName}</p>
          <p><strong>Ghi chú:</strong> ${message || 'Không có'}</p>
          <hr />
          <p>Vui lòng đăng nhập vào trang Quản trị để xử lý yêu cầu này.</p>
        </div>
      `
    };

    await sendEmail(emailOptions);

    res.status(201).json({
      message: 'Yêu cầu của bạn đã được gửi thành công. Đội ngũ KINETIC sẽ liên hệ sớm nhất!',
      data: newRequest
    });

  } catch (error) {
    console.error('Partnership error:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.' });
  }
};

module.exports = { submitPartnership };
