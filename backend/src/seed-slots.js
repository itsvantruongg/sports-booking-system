const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Court = require('./models/Court');
const TimeSlot = require('./models/TimeSlot');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedSlots = async () => {
  try {
    const courts = await Court.find({ status: 'ACTIVE' });
    if (courts.length === 0) {
      console.log('Không có sân nào hoạt động.');
      process.exit();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const datesToSeed = [
      new Date(today), // Hôm nay
      new Date(today.getTime() + 24 * 60 * 60 * 1000), // Ngày mai
      new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Ngày mốt
    ];

    let slotsToInsert = [];

    for (const court of courts) {
      for (const date of datesToSeed) {
        // Tạo slots từ 06:00 đến 22:00, mỗi slot 1 tiếng
        for (let hour = 6; hour < 22; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00`;
          const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
          
          slotsToInsert.push({
            court_id: court._id,
            slot_date: date,
            start_time: startTime,
            end_time: endTime,
            price: 100000, // Giá 100k
            status: 'AVAILABLE'
          });
        }
      }
    }

    // Xóa các slot cũ bị trùng hoặc xóa hết để tạo lại cho sạch
    await TimeSlot.deleteMany({});
    
    if (slotsToInsert.length > 0) {
      await TimeSlot.insertMany(slotsToInsert);
    }

    console.log(`✅ Đã tạo thành công ${slotsToInsert.length} khung giờ trống cho các sân (sử dụng bulk insert).`);
    process.exit();
  } catch (err) {
    console.error('Lỗi tạo slot:', err);
    process.exit(1);
  }
};

seedSlots();
