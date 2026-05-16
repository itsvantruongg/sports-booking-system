require('dotenv').config();
const mongoose = require('mongoose');
const { sendZaloNotification } = require('./utils/zaloService');

async function testZalo() {
  try {
    // Kết nối Database để lấy cấu hình Zalo (nếu có)
    console.log('Đang kết nối Database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối Database.');

    console.log('--- Đang bắt đầu gửi tin nhắn Zalo thử nghiệm ---');
    
    // Đọc từ .env để bảo mật
    const testPhone = process.env.TEST_PHONE; 
    
    if (!testPhone) {
      throw new Error('Vui lòng cấu hình TEST_PHONE trong file .env');
    }

    console.log(`Đang gửi thử tới số: ${testPhone}`);

    const result = await sendZaloNotification(testPhone, {
      text: `[KINETIC TEST] Hệ thống thông báo Zalo đã sẵn sàng. Thời gian: ${new Date().toLocaleString('vi-VN')}`
    });

    if (result && result.error === 0) {
      console.log('✅ THÀNH CÔNG: Tin nhắn Zalo đã được gửi đi!');
      console.log('Chi tiết phản hồi:', result);
    } else {
      console.log('❌ THẤT BẠI: Zalo trả về lỗi.');
      console.log('Chi tiết lỗi từ Zalo:', result);
      console.log('\nLưu ý: Nếu bạn chưa có Zalo OA và Access Token đúng trong DB/env, lỗi này là bình thường.');
    }
  } catch (error) {
    console.error('❌ LỖI HỆ THỐNG:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

testZalo();
