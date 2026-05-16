const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load biến môi trường
dotenv.config();

// Kết nối Database
connectDB();

const importUsers = async () => {
  try {
    // Xóa tất cả user cũ để test (tuỳ chọn, nhưng tiện để làm mới)
    await User.deleteMany({});

    // 1. Kiểm tra Admin
    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (!adminExists) {
      await User.create({
        name: 'Admin Test',
        email: 'admin@test.com',
        password: 'password123',
        role: 'ADMIN',
      });
      console.log('✅ Đã tạo Admin: admin@test.com / password123');
    } else {
      console.log('⚠️ Admin đã tồn tại.');
    }

    // 2. Kiểm tra Owner
    let ownerId;
    const ownerExists = await User.findOne({ role: 'OWNER' });
    if (!ownerExists) {
      const owner = await User.create({
        name: 'Owner Test',
        email: 'owner@test.com',
        password: 'password123',
        role: 'OWNER',
        must_change_password: false // Để test cho dễ
      });
      ownerId = owner._id;
      console.log('✅ Đã tạo Owner: owner@test.com / password123');
    } else {
      ownerId = ownerExists._id;
      console.log('⚠️ Owner đã tồn tại.');
    }

    // 3. Kiểm tra User
    const userExists = await User.findOne({ role: 'USER' });
    if (!userExists) {
      await User.create({
        name: 'User Test',
        email: 'user@test.com',
        password: 'password123',
        role: 'USER',
      });
      console.log('✅ Đã tạo User: user@test.com / password123');
    } else {
      console.log('⚠️ User đã tồn tại.');
    }

    // --- IMPORT SAMPLE DATA FOR OWNER ---
    const SportType = require('./models/SportType');
    const VenueCluster = require('./models/VenueCluster');
    const Court = require('./models/Court');

    // Xóa data cũ của owner test
    await VenueCluster.deleteMany({ owner_id: ownerId });
    // Note: To be fully clean we should delete related Courts but deleteMany VenueCluster is enough for this test demo

    // Seed SportTypes if not exist
    const sports = [
      { name: 'Bóng đá', slug: 'bong-da' },
      { name: 'Tennis', slug: 'tennis' },
      { name: 'Cầu lông', slug: 'cau-long' },
      { name: 'Đa năng', slug: 'da-nang' }
    ];
    const sportMap = {};
    for (const s of sports) {
      let st = await SportType.findOne({ slug: s.slug });
      if (!st) st = await SportType.create(s);
      sportMap[s.name] = st._id;
    }

    // Seed VenueClusters and Courts
    const venuesData = [
      { name: 'Sân Bóng Đá Chảo Lửa', address: '30 Phan Thúc Duyện, Phường 4, Tân Bình', district: 'Quận Tân Bình', city: 'TP. Hồ Chí Minh', lat: 10.8012, lng: 106.6601, sport: 'Bóng đá', phone: '0397263588' },
      { name: 'Sân Vận Động Hoa Lư', address: '2 Đinh Tiên Hoàng, Đa Kao, Quận 1', district: 'Quận 1', city: 'TP. Hồ Chí Minh', lat: 10.7856, lng: 106.7023, sport: 'Đa năng', phone: '0397263588' },
      { name: 'CLB Tennis Kỳ Hòa', address: '239 Ba Tháng Hai, Phường 12, Quận 10', district: 'Quận 10', city: 'TP. Hồ Chí Minh', lat: 10.7745, lng: 106.6712, sport: 'Tennis', phone: '0397263588' },
      { name: 'Nhà Thi Đấu T19', address: '43 Thành Thái, Phường 14, Quận 10', district: 'Quận 10', city: 'TP. Hồ Chí Minh', lat: 10.7712, lng: 106.6623, sport: 'Cầu lông', phone: '0397263588' },
      { name: 'Sân Vận Động Hàng Đẫy', address: '9 Trịnh Hoài Đức, Cát Linh, Đống Đa', district: 'Quận Đống Đa', city: 'Hà Nội', lat: 21.0298, lng: 105.8321, sport: 'Bóng đá', phone: '0397263588' },
      { name: 'Khu Thể Thao Quần Ngựa', address: '30 Văn Cao, Liễu Giai, Ba Đình', district: 'Quận Ba Đình', city: 'Hà Nội', lat: 21.0367, lng: 105.8156, sport: 'Tennis', phone: '0397263588' },
      { name: 'CLB Thể Thao Ciputra', address: 'Khu đô thị Ciputra, Tây Hồ', district: 'Quận Tây Hồ', city: 'Hà Nội', lat: 21.0745, lng: 105.8012, sport: 'Cầu lông', phone: '0397263588' },
      { name: 'Sân Bóng Đá Thành Đồng', address: 'B9 Khu đô thị Nam Trung Yên, Cầu Giấy', district: 'Quận Cầu Giấy', city: 'Hà Nội', lat: 21.0123, lng: 105.7912, sport: 'Bóng đá', phone: '0397263588' },
      { name: 'Cung Thể Thao Tuyên Sơn', address: 'Nại Nam 2, Hòa Cường Bắc, Hải Châu', district: 'Quận Hải Châu', city: 'Đà Nẵng', lat: 16.0345, lng: 108.2234, sport: 'Tennis', phone: '0397263588' },
      { name: 'Sân Bóng Đá Duy Tân', address: '7 Duy Tân, Hòa Thuận Tây, Hải Châu', district: 'Quận Hải Châu', city: 'Đà Nẵng', lat: 16.0512, lng: 108.2156, sport: 'Bóng đá', phone: '0397263588' }
    ];

    for (let i = 0; i < venuesData.length; i++) {
      const v = venuesData[i];
      const cluster = await VenueCluster.create({
        owner_id: ownerId,
        name: v.name,
        slug: 'venue-' + Date.now() + '-' + i,
        address: v.address,
        district: v.district,
        city: v.city,
        lat: v.lat,
        lng: v.lng,
        description: `Sân thể thao chất lượng cao tại ${v.district}, ${v.city}. Liên hệ: ${v.phone}`,
        status: 'ACTIVE'
      });

      // Tạo sẵn 2 sân con cho mỗi cụm
      await Court.create({
        cluster_id: cluster._id,
        sport_type_id: sportMap[v.sport] || sportMap['Bóng đá'],
        name: `${v.name} - Sân 1`,
        status: 'ACTIVE'
      });
      await Court.create({
        cluster_id: cluster._id,
        sport_type_id: sportMap[v.sport] || sportMap['Bóng đá'],
        name: `${v.name} - Sân 2`,
        status: 'ACTIVE'
      });
    }
    console.log('✅ Đã import dữ liệu sân mẫu cho owner@test.com');

    process.exit();
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo User:', error);
    process.exit(1);
  }
};

importUsers();
