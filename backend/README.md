# Kinetic Backend — Sports Booking System API

Đây là phần xử lý logic và cơ sở dữ liệu của hệ thống Kinetic, được xây dựng bằng Node.js, Express và MongoDB.

## 🛠 Hướng dẫn cài đặt

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   - Copy file `.env.example` thành `.env`.
   - Điền các thông tin về `MONGODB_URI`, `JWT_SECRET`, và cấu hình `EMAIL` để hệ thống hoạt động.

3. **Chạy server**:
   ```bash
   npm run dev
   ```

## 🗄 Quản lý Cơ sở dữ liệu (Database)

Trong quá trình phát triển và test UI/UX, bạn có thể sử dụng các script sau để quản lý dữ liệu:

### 1. Dọn sạch Database
Sử dụng script này khi bạn muốn xóa toàn bộ dữ liệu (User, Sân, Lịch đặt...) để làm lại từ đầu:
```bash
node clean_db.js
```

### 2. Khởi tạo dữ liệu mẫu (Seeder)
Sau khi dọn sạch DB, hãy chạy lệnh này để tạo lại các tài khoản Admin, Owner, User và danh sách sân bóng mẫu:
```bash
node src/seeder.js
```
*Thông tin tài khoản mặc định được cấu hình trong file `.env` (Xem các biến `SEED_...`)*

### 3. Tạo khung giờ trống (Slots)
Để có thể đặt sân trên giao diện, bạn cần tạo các khung giờ trống cho các sân vừa khởi tạo:
```bash
node src/seed-slots.js
```

## 🧪 Các công cụ Test khác

- **Test Email**: `node src/test-email.js` (Kiểm tra cấu hình gửi mail đặt lại mật khẩu).
- **Test Zalo**: `node src/test-zalo.js` (Kiểm tra thông báo qua Zalo).

## 📖 Tài liệu API (Swagger)

Hệ thống hỗ trợ Swagger để bạn có thể xem và test API trực tiếp:
- **Địa chỉ**: `http://localhost:5000/api-docs`

---
*Lưu ý: Không bao giờ đẩy file `.env` lên các kho lưu trữ công khai (GitHub).*
