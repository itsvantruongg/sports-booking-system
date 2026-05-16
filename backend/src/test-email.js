require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

async function testEmail() {
  console.log('--- Đang bắt đầu gửi Email thử nghiệm ---');
  console.log(`Email gửi từ: ${process.env.EMAIL_USER}`);
  console.log(`Email nhận: ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}`);

  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'KINETIC - Kiểm tra hệ thống Email',
      html: `
        <div style="font-family: sans-serif; border: 1px solid #003ec7; padding: 20px; border-radius: 10px;">
          <h2 style="color: #003ec7;">Kết nối thành công!</h2>
          <p>Nếu bạn nhận được email này, có nghĩa là cấu hình Gmail trong file <b>.env</b> của bạn đã hoạt động hoàn hảo.</p>
          <hr />
          <p>Thời gian gửi: ${new Date().toLocaleString('vi-VN')}</p>
        </div>
      `
    });
    console.log('✅ THÀNH CÔNG: Email đã được gửi đi! Vui lòng kiểm tra hòm thư của bạn.');
  } catch (error) {
    console.error('❌ THẤT BẠI: Không thể gửi email.');
    console.error('Chi tiết lỗi:', error.message);
    console.log('\nGợi ý khắc phục:');
    console.log('1. Kiểm tra lại EMAIL_USER và EMAIL_PASS (phải là mật khẩu ứng dụng 16 ký tự).');
    console.log('2. Đảm bảo EMAIL_HOST và EMAIL_PORT chính xác (smtp.gmail.com / 587).');
  }
}

testEmail();
