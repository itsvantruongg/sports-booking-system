const mongoose = require('mongoose');
require('dotenv').config();

// Import tất cả các Models
const User = require('./src/models/User');
const VenueCluster = require('./src/models/VenueCluster');
const Court = require('./src/models/Court');
const Booking = require('./src/models/Booking');
const Notification = require('./src/models/Notification');
const Partnership = require('./src/models/Partnership');
const PaymentConfig = require('./src/models/PaymentConfig');
const PricingRule = require('./src/models/PricingRule');
const Review = require('./src/models/Review');
const SlotGenerationLog = require('./src/models/SlotGenerationLog');
const SpecialDay = require('./src/models/SpecialDay');
const SportType = require('./src/models/SportType');
const TimeSlot = require('./src/models/TimeSlot');
const ZaloConfig = require('./src/models/ZaloConfig');

const cleanDB = async () => {
  try {
    // Kết nối Database
    if (!process.env.MONGODB_URI) {
        console.error('❌ Lỗi: MONGODB_URI không tồn tại trong file .env');
        process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🚀 Đang kết nối Database...');
    console.log('⚠️  CẢNH BÁO: Đang tiến hành xóa TOÀN BỘ dữ liệu hệ thống...\n');

    const collections = [
        { name: 'Người dùng', model: User },
        { name: 'Cụm sân (VenueCluster)', model: VenueCluster },
        { name: 'Sân (Court)', model: Court },
        { name: 'Đơn đặt sân (Booking)', model: Booking },
        { name: 'Thông báo (Notification)', model: Notification },
        { name: 'Đối tác (Partnership)', model: Partnership },
        { name: 'Cấu hình thanh toán', model: PaymentConfig },
        { name: 'Quy tắc giá (PricingRule)', model: PricingRule },
        { name: 'Đánh giá (Review)', model: Review },
        { name: 'Log hệ thống (SlotGeneration)', model: SlotGenerationLog },
        { name: 'Ngày đặc biệt', model: SpecialDay },
        { name: 'Loại môn thể thao', model: SportType },
        { name: 'Khung giờ (TimeSlot)', model: TimeSlot },
        { name: 'Cấu hình Zalo OA', model: ZaloConfig }
    ];

    for (const item of collections) {
        const count = await item.model.countDocuments();
        await item.model.deleteMany({});
        console.log(`✅ Đã dọn sạch ${count.toString().padStart(3, ' ')} bản ghi tại bảng: ${item.name}`);
    }

    console.log('\n✨ HỆ THỐNG ĐÃ ĐƯỢC LÀM MỚI HOÀN TOÀN! (DATABASE CLEANED)');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ LỖI NGHIÊM TRỌNG:', error.message);
    process.exit(1);
  }
};

// Chạy script
cleanDB();
