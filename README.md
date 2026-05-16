# Kinetic — Hệ thống Đặt sân Thể thao Thông minh

Kinetic là một nền tảng hiện đại giúp kết nối người chơi thể thao với các chủ sân, tối ưu hóa quy trình đặt chỗ và thanh toán một cách nhanh chóng, tiện lợi.

## 🚀 Tính năng nổi bật

### 1. Trải nghiệm người dùng (User)
- **Giao diện hiện đại**: Thiết kế theo phong cách Glassmorphism sang trọng, mượt mà.
- **Tìm kiếm thông minh**: Lọc sân theo môn thể thao, vị trí và thời gian thực.
- **Đặt sân nhanh chóng**: Quy trình đặt sân chỉ với vài click.
- **Đa dạng thanh toán**: 
  - Thanh toán online qua cổng **VNPay**.
  - Chuyển khoản ngân hàng với mã **VietQR** tự động điền thông tin.
  - Thanh toán tiền mặt tại sân.

### 2. Quản lý chủ sân (Owner Portal)
- **Dashboard trực quan**: Theo dõi doanh thu, lịch đặt và lượng khách hàng.
- **Quản lý cụm sân**: Thêm mới, chỉnh sửa thông tin sân, giờ hoạt động và bảng giá.
- **Thông báo thời gian thực**: Nhận thông báo đặt sân mới trực tiếp trên hệ thống và qua **Zalo**.

### 3. Quản trị hệ thống (Admin Portal)
- **Kiểm soát toàn diện**: Quản lý danh sách người dùng, đối tác và các cụm sân trên hệ thống.
- **Duyệt đối tác**: Quy trình Onboarding chuyên nghiệp cho chủ sân mới.

## 🛠 Công nghệ sử dụng

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **UI/UX**: Material Symbols, Google Fonts (Plus Jakarta Sans), Glassmorphism Design.
- **Backend**: Node.js, Express, MongoDB.
- **Integrations**: VNPay API, VietQR (PayOS/VietQR.io), Zalo Notification Service, Nodemailer.

## 📦 Cài đặt và Chạy thử

### Yêu cầu hệ thống
- Node.js 18+
- MongoDB (Local hoặc Atlas)

### Các bước cài đặt

1. **Clone dự án**:
   ```bash
   git clone https://github.com/itsvantruongg/sports-booking-system.git
   cd sports-booking-system
   ```

2. **Cấu hình biến môi trường**:
   - Vào thư mục `backend/`, copy file `.env.example` thành `.env` và điền các thông tin cần thiết.

3. **Chạy Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Chạy Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Truy cập**:
   - Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) cho frontend
   - Mở trình duyệt tại [http://localhost:5000/api-docs](http://localhost:5000/api-docs) cho backend


## 👤 About Author

### **Nguyễn Vân Trường**

**Fullstack Developer**

[Contact Me](https://itsvantruongg.github.io/myprofile/)