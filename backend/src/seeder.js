const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load biến môi trường
dotenv.config();

// Kết nối Database
connectDB();

const importAdmin = async () => {
  try {
    // 1. Kiểm tra xem đã có Admin nào chưa
    const adminExists = await User.findOne({ role: 'ADMIN' });
    
    if (adminExists) {
      console.log('⚠️ Tài khoản Admin đã tồn tại trong hệ thống. Không thể tạo thêm bằng lệnh này.');
      process.exit();
    }

    // 2. Tạo tài khoản Admin gốc (Super Admin)
    const adminUser = await User.create({
      name: 'Kinetic Administrator',
      email: 'admin@kinetic.com',
      password: 'KineticAdmin@2026', // Mật khẩu mạnh
      role: 'ADMIN',
      isFirstLogin: false, // Admin thì không bị ép đổi mật khẩu lúc login
    });

    console.log('✅ Đã khởi tạo thành công tài khoản SUPER ADMIN:');
    console.log('-----------------------------------');
    console.log(`Email:    ${adminUser.email}`);
    console.log(`Password: KineticAdmin@2026`);
    console.log('-----------------------------------');
    console.log('Vui lòng lưu lại thông tin này để quản lý hệ thống!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo Admin:', error);
    process.exit(1);
  }
};

importAdmin();
