# 🏟️ Kinetic Sports Booking — Đánh giá & Kế hoạch Hoàn thiện

## 📊 Tổng quan hiện trạng

### Những gì ĐÃ CÓ

| Module | Trang Frontend | API Backend | Trạng thái |
|--------|---------------|-------------|------------|
| **Auth** | Login, Register | login, register, refresh, force-change | ✅ Hoạt động |
| **Public Home** | Landing page (`/`) | — | ✅ Hoạt động |
| **Public Fields** | Danh sách sân (`/fields`) | GET /public/venues | ✅ Hoạt động |
| **User Home** | Trang chủ User (`/user`) | GET /public/venues | ✅ Hoạt động |
| **User Fields** | DS sân (`/user/fields`) | GET /public/venues | ✅ Hoạt động |
| **User Book** | Đặt sân (`/user/book/[id]`) | POST /users/bookings, GET time-slots | ✅ Hoạt động |
| **User History** | Lịch sử (`/user/history`) | GET /users/bookings | ✅ Hoạt động |
| **User Profile** | Hồ sơ (`/user/profile`) | GET/PUT /users/me | ✅ Hoạt động |
| **Owner Dashboard** | Tổng quan (`/owner`) | GET /owner/dashboard | ✅ Hoạt động |
| **Owner Courts** | Quản lý sân (`/owner/courts`) | GET /owner/courts | ✅ Hoạt động |
| **Owner Timeline** | Lịch sân (`/owner/timeline`) | GET /owner/time-slots | ✅ Hoạt động |
| **Owner Revenue** | Doanh thu (`/owner/revenue`) | GET /owner/reports | ✅ Hoạt động |
| **Owner Customers** | Khách hàng (`/owner/customers`) | GET /owner/customers | ✅ Hoạt động |
| **Owner Change PWD** | Đổi MK (`/owner/change-password`) | POST /auth/force-change | ✅ Hoạt động |
| **Admin Dashboard** | Tổng quan (`/admin`) | GET /admin/dashboard | ⚠️ Dữ liệu giả (hardcoded) |
| **Admin Users** | Quản lý Users (`/admin/users`) | GET /admin/users, PUT status | ✅ Hoạt động |
| **Admin Courts** | Quản lý sân (`/admin/courts`) | GET /admin/venues | ✅ Hoạt động |
| **Admin Add Partner** | Thêm Owner (`/admin/add-partner`) | POST /admin/owners | ✅ Hoạt động |
| **Admin Settings** | Cài đặt (`/admin/settings`) | POST /admin/sport-types | ✅ Hoạt động |

---

## 🔴 Các chức năng THIẾU (So với một app booking thật)

### 1. PUBLIC — Trải nghiệm khách vãng lai

| # | Chức năng | Mô tả | Độ ưu tiên |
|---|----------|-------|------------|
| P1 | **Trang chi tiết sân (Public)** | Xem thông tin venue + reviews + ảnh mà không cần login. Hiện chỉ có `/fields` list, chưa có `/fields/[id]` detail | 🔴 Cao |
| P2 | **Bộ lọc & Tìm kiếm nâng cao** | Search bar ở Hero hiện chưa hoạt động (chỉ redirect). Cần lọc theo sport type, city, district thực tế | 🟡 Trung bình |
| P3 | **Xem reviews/đánh giá công khai** | Hiển thị reviews của venue trên trang public detail | 🟡 Trung bình |

### 2. USER — Người đặt sân

| # | Chức năng | Mô tả | Độ ưu tiên |
|---|----------|-------|------------|
| U1 | **Hủy đặt sân (Cancel Booking)** | Nút "Cancel" trong History hiện chưa gọi API `POST /users/bookings/:id/cancel` | 🔴 Cao |
| U2 | **Xem chi tiết đơn đặt sân** | Link "View Details" trong History trỏ tới `/user/history/:id` nhưng **chưa có trang này** | 🔴 Cao |
| U3 | **Gửi đánh giá (Review)** | API `POST /users/reviews` đã có, nhưng **frontend chưa có form đánh giá** sau khi hoàn tất booking | 🔴 Cao |
| U4 | **Thông báo realtime** | Nút 🔔 trên header chưa có chức năng. Backend đã có model Notification + Socket.io | 🟡 Trung bình |
| U5 | **Thanh toán trực tuyến** | Booking hiện tạo ở trạng thái PENDING, chưa có flow thanh toán (VNPay/MoMo/Banking) | 🟡 Trung bình |
| U6 | **Đổi mật khẩu (User)** | Trang Profile có form đổi mật khẩu nhưng cần kiểm tra xem có gọi API đúng không | 🟢 Thấp |
| U7 | **Sân yêu thích (Favorites)** | Chưa có tính năng lưu sân yêu thích để đặt nhanh lần sau | 🟢 Thấp |

### 3. OWNER — Chủ sân

| # | Chức năng | Mô tả | Độ ưu tiên |
|---|----------|-------|------------|
| O1 | **Xác nhận/Từ chối booking** | Owner chưa có nút Accept/Reject cho các đơn đặt sân PENDING | 🔴 Cao |
| O2 | **Quản lý thông tin venue** | API `PUT /owner/venues/:id` đã có nhưng **frontend chưa có form chỉnh sửa** (mô tả, ảnh, tiện ích) | 🔴 Cao |
| O3 | **Cấu hình giá sân** | API `POST /owner/pricing-rules` đã có nhưng **frontend chưa có UI quản lý giá** | 🔴 Cao |
| O4 | **Khóa slot thủ công** | API `POST /owner/time-slots/block` đã có nhưng **frontend Timeline chưa có nút khóa** | 🟡 Trung bình |
| O5 | **Dashboard lấy data thật** | Dashboard hiện đã gọi API nhưng phần "Recent Bookings" chưa hiển thị danh sách thật | 🟡 Trung bình |
| O6 | **Thông báo đơn đặt mới** | Socket.io đã setup nhưng chưa kết nối frontend để push notification khi có booking mới | 🟡 Trung bình |
| O7 | **Xuất báo cáo CSV/PDF** | Nút "Xuất CSV" ở trang Customers chưa hoạt động | 🟢 Thấp |

### 4. ADMIN — Quản trị hệ thống

| # | Chức năng | Mô tả | Độ ưu tiên |
|---|----------|-------|------------|
| A1 | **Dashboard lấy data thật** | Tất cả số liệu (142k users, 3,402 partners...) đều là **hardcoded**, chưa gọi API `/admin/dashboard` | 🔴 Cao |
| A2 | **Quản lý chi tiết Venue** | Có thể xem danh sách venue nhưng **chưa có trang chi tiết + khóa/mở khóa** (API đã có) | 🟡 Trung bình |
| A3 | **Quản lý Sport Types** | API `POST /admin/sport-types` đã có nhưng **chưa có UI xem/sửa/xóa** danh sách môn thể thao | 🟡 Trung bình |
| A4 | **Xem tổng bookings toàn hệ thống** | Admin chưa có trang xem tất cả bookings trên nền tảng | 🟢 Thấp |
| A5 | **Logs & Audit trail** | Chưa có hệ thống ghi lại hành động quản trị | 🟢 Thấp |

---

## 📋 Kế hoạch triển khai theo Phase

### 🚀 Phase 1 — Hoàn thiện Core Flow (Ưu tiên cao nhất)
> **Mục tiêu:** Đảm bảo flow đặt sân hoàn chỉnh từ đầu đến cuối

| STT | Task | Module | Chi tiết |
|-----|------|--------|----------|
| 1.1 | Hủy đặt sân (U1) | User | Kết nối nút Cancel → API `POST /users/bookings/:id/cancel`. Hiện confirm dialog + cập nhật UI |
| 1.2 | Chi tiết booking (U2) | User | Tạo trang `/user/history/[id]` hiển thị đầy đủ thông tin đơn (sân, ngày, giờ, giá, trạng thái) |
| 1.3 | Form đánh giá (U3) | User | Sau khi booking COMPLETED, hiển thị form gửi review (1-5 sao + comment) → API `POST /users/reviews` |
| 1.4 | Admin Dashboard thật (A1) | Admin | Gọi API `/admin/dashboard` thay thế data hardcoded |
| 1.5 | Public venue detail (P1) | Public | Tạo `/fields/[id]` cho phép xem chi tiết venue mà không cần login, nút "Đặt sân" → redirect login |

### 🔧 Phase 2 — Owner Management Tools
> **Mục tiêu:** Owner có thể quản lý sân đầy đủ

| STT | Task | Module | Chi tiết |
|-----|------|--------|----------|
| 2.1 | Xác nhận booking (O1) | Owner | Thêm API `PUT /owner/bookings/:id/status` + UI nút Accept/Reject trên dashboard |
| 2.2 | Form chỉnh sửa venue (O2) | Owner | Trang edit venue: mô tả, ảnh (upload), tiện ích, giờ mở cửa |
| 2.3 | UI quản lý giá sân (O3) | Owner | Trang Pricing Rules: tạo/sửa/xóa quy tắc giá theo giờ, ngày trong tuần |
| 2.4 | Khóa slot (O4) | Owner | Thêm nút khóa slot trên Timeline khi owner cần block lịch |
| 2.5 | Recent Bookings thật (O5) | Owner | Dashboard hiển thị 5 đơn đặt sân gần nhất (gọi API `/owner/bookings?limit=5`) |

### 🔔 Phase 3 — Nâng cao trải nghiệm
> **Mục tiêu:** UX mượt mà, chuyên nghiệp

| STT | Task | Module | Chi tiết |
|-----|------|--------|----------|
| 3.1 | Bộ lọc tìm kiếm (P2) | Public | Search bar hoạt động: lọc theo sport type, city, district từ API |
| 3.2 | Thông báo realtime (U4, O6) | All | Kết nối Socket.io: push notification khi có booking mới / xác nhận / hủy |
| 3.3 | Admin quản lý venue (A2) | Admin | Chi tiết venue + nút khóa/mở khóa gọi API `PUT /admin/venues/:id/status` |
| 3.4 | Admin Sport Types UI (A3) | Admin | CRUD danh sách môn thể thao (hiện mới có Create) |
| 3.5 | Reviews công khai (P3) | Public | Hiển thị reviews trên trang chi tiết sân công khai |

### 💎 Phase 4 — Tính năng Premium
> **Mục tiêu:** Nâng app lên tầm sản phẩm thương mại

| STT | Task | Module | Chi tiết |
|-----|------|--------|----------|
| 4.1 | Thanh toán trực tuyến (U5) | User | Tích hợp VNPay/MoMo: tạo payment URL → callback xác nhận → cập nhật booking |
| 4.2 | Sân yêu thích (U7) | User | Model Favorite + API + UI nút ♥ trên card sân |
| 4.3 | Xuất báo cáo (O7) | Owner | Export CSV/PDF cho doanh thu và danh sách khách hàng |
| 4.4 | Email notifications | All | Gửi email xác nhận booking, nhắc lịch, hóa đơn |
| 4.5 | Responsive Mobile | All | Kiểm tra và tối ưu toàn bộ UI cho mobile |

---

## 📁 Tóm tắt cấu trúc Backend hiện có

```
Models: User, VenueCluster, Court, TimeSlot, Booking, PricingRule, 
        Review, Notification, SportType, SpecialDay, SlotGenerationLog

Auth:   register, login, refresh, force-change-password
Public: sport-types, venues (list + detail), court time-slots  
User:   me (get/put), bookings (CRUD + cancel), reviews (create)
Owner:  dashboard, venues (list + update), courts, pricing-rules,
        time-slots (list + block), bookings, reports, customers
Admin:  dashboard, owners (create), users (list + ban), venues (list + ban),
        sport-types (create)
```

## 🎯 Khuyến nghị bắt đầu

> **Bắt đầu từ Phase 1** — Đây là những chức năng mà user sẽ thấy "thiếu" ngay lập tức khi sử dụng app. Hoàn thành Phase 1 sẽ giúp app có một flow đặt sân hoàn chỉnh: Xem sân → Đặt → Xem lịch sử → Hủy/Đánh giá.

Khi bạn sẵn sàng, hãy nói **"Bắt đầu Phase 1"** và tôi sẽ code từng task một cho bạn! 🚀
