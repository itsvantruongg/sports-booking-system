# Thiết kế Hệ thống Đặt sân Thể thao (Kinetic / Velocity Court)

Tài liệu này tổng hợp thiết kế UI/UX và cấu trúc của hệ thống đặt sân thể thao dựa trên các thiết kế từ Stitch.

## 1. Tổng quan & Định hướng Thiết kế (Creative North Star)
Hệ thống sử dụng phong cách thiết kế **"The Kinetic Gallery"**, hướng đến việc kết hợp giữa năng lượng thể thao mạnh mẽ và sự tinh tế, rõ ràng của các sản phẩm cao cấp (luxury editorial). 
Giao diện không sử dụng các đường viền (borders) cứng nhắc truyền thống, thay vào đó sử dụng không gian mở (wide-open gutters) và các container xếp chồng lên nhau (floating containers) tạo cảm giác chuyển động. 

Mục tiêu là mang lại cảm giác của một "lounge cao cấp"—rộng rãi, chuyên nghiệp và mượt mà—dành cho các "vận động viên hiện đại".

---

## 2. Màu sắc (Colors) & Bề mặt (Surface Architecture)
Bảng màu cân bằng giữa sự chính xác của công nghệ ("Vibrant Blue") và sự năng động, tươi mát của thể thao ("Emerald Green").

### Bảng màu chính:
*   **Primary (`#003ec7`):** Màu xanh dương chủ đạo dùng cho các hành động chính và nhận diện thương hiệu.
*   **Secondary (`#006e2a`):** Màu xanh lá dùng cho các trạng thái thành công, thông báo "Có sẵn ngay" và các điểm nhấn năng lượng phụ.
*   **Background (`#fbf8ff`):** Màu nền trắng pha chút lạnh giúp chống mỏi mắt và mang lại cảm giác cao cấp hơn trắng tinh (`#FFFFFF`).
*   **Text/On-Surface (`#191b25` & `#434656`):** Màu chữ chính và phụ.

### Quy tắc "Không đường viền" (The "No-Line" Rule)
*   **Cấm sử dụng đường viền** để chia bố cục. Ranh giới phải được tạo ra thông qua sự thay đổi sắc độ nền (ví dụ: từ `surface` sang `surface-container-low`).
*   Sử dụng hiệu ứng kính (Glassmorphism) cho navigation hoặc filter với background mờ (`backdrop-blur`).
*   **Hiệu ứng Gradient:** Nút bấm CTA chính dùng gradient từ `primary` (`#003ec7`) sang `primary_container` (`#0052ff`) ở góc 135°.

---

## 3. Typography
Sử dụng kết hợp 2 font chữ hiện đại:
*   **Plus Jakarta Sans (Display & Headlines):** Dùng cho tiêu đề lớn, tạo cảm giác hành động và mạnh mẽ. Khoảng cách chữ hẹp (`tracking-tight`).
*   **Inter (Titles & Body):** Dùng cho nội dung, thông tin chi tiết (giờ, giá cả) cần độ dễ đọc cao.

---

## 4. Cấu trúc Màn hình & Phân quyền (Roles)

Hệ thống được chia làm 3 vai trò (roles) chính với các màn hình tương ứng:

### 4.1. Khách hàng (User/Customer)
*   **Trang chủ (Home Page):** Màn hình chính tìm kiếm sân theo môn thể thao, địa điểm, ngày giờ, cùng danh sách sân nổi bật.
*   **Danh sách sân (Field List):** Hiển thị danh sách sân theo bộ lọc tìm kiếm.
*   **Chi tiết sân (Field Detail):** Thông tin chi tiết, hình ảnh, giá cả, và tiện ích của một sân cụ thể.
*   **Đặt lịch (Booking Form):** Quy trình chọn giờ, dịch vụ và thanh toán.
*   **Lịch sử đặt sân (Booking History):** Theo dõi các sân đã đặt, trạng thái thành công/chờ xử lý.
*   **Hồ sơ cá nhân (Personal Profile):** Quản lý thông tin tài khoản người dùng.

### 4.2. Chủ sân / Đối tác (Owner/Partner)
*   **Dashboard Tổng quan (Overview Dashboard):** Xem tổng thể tình hình hoạt động của các sân.
*   **Quản lý lịch (Timeline):** Theo dõi lịch đặt sân của khách theo dạng biểu đồ thời gian thực.
*   **Báo cáo doanh thu (Revenue Report):** Thống kê thu nhập, số lượng đơn đặt.
*   **Quản lý danh mục sân (Court Category Management):** Thêm/Sửa/Xóa các sân, cập nhật trạng thái trống.
*   **Quản lý khách hàng (Customer Management):** Quản lý thông tin khách hàng đặt sân.
*   **Đổi mật khẩu bắt buộc (Mandatory Password Change):** Flow bảo mật khi đối tác mới được cấp tài khoản.

### 4.3. Quản trị viên hệ thống (Admin)
*   **Master Dashboard:** Bảng điều khiển tổng của toàn hệ thống (Super Admin).
*   **Quản lý người dùng (User Management):** Quản lý cả khách hàng và chủ sân.
*   **Thêm đối tác mới (Add New Partner):** Phê duyệt hoặc tạo mới tài khoản cho các chủ sân tham gia hệ thống.
*   **Cài đặt hệ thống (System Settings):** Cấu hình chung của nền tảng.

---

## 5. UI Components & Patterns

*   **Cards (Thẻ nội dung):** Không dùng divider. Góc bo tròn lớn `lg` (2rem) hoặc `xl` (3rem) tạo cảm giác thân thiện. Đổ bóng (Ambient Shadows) nhẹ và lan rộng (`blur: 40-60px`).
*   **Buttons:**
    *   *Primary:* Nền `primary`, bo tròn `full`. 
    *   *Secondary:* Nền xanh lá `secondary_fixed` cho các xác nhận đặt sân.
*   **Inputs:** Form nhập liệu lớn (md - 1.5rem rounded). Khi focus dùng border mờ "Ghost Border" 2px thay vì viền đậm.
*   **Chips & Filters:** Dùng màu xanh lá `secondary_container` cho trạng thái đang active.

## 6. Iconography
Sử dụng bộ icon **Material Symbols Outlined** để đồng bộ với ngôn ngữ thiết kế tối giản, sắc nét của UI.
