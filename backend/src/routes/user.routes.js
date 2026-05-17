const express = require('express');
const router = express.Router();
const {
  getMe, updateMe,
  createBooking, getMyBookings, getBookingById, cancelBooking,
  createReview,
  getFavorites, addFavorite, removeFavorite,
  processPayment, getVenueVouchers, validateVoucher,
  claimVoucher, getMyVouchers, applyVoucherToBooking
} = require('../controllers/user.controller');
const { protect, checkMustChangePassword } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Tất cả routes đều cần đăng nhập
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and booking management (Requires JWT)
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin User
 *   put:
 *     summary: Cập nhật thông tin cá nhân (tên, số điện thoại)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.get('/me', getMe);
router.put('/me', updateMe);

// Các route bên dưới yêu cầu đã đổi mật khẩu
router.use(checkMustChangePassword);

/**
 * @swagger
 * /api/users/bookings:
 *   post:
 *     summary: Đặt sân (Giữ chỗ 10 phút)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [court_id, booking_date, time_slot_ids]
 *             properties:
 *               court_id: { type: string }
 *               booking_date: { type: string, format: date }
 *               time_slot_ids: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Tạo booking thành công
 *   get:
 *     summary: Xem danh sách đơn đặt sân của tôi
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [UPCOMING, COMPLETED] }
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
router.post('/bookings', createBooking);
router.get('/bookings', getMyBookings);

/**
 * @swagger
 * /api/users/bookings/{id}:
 *   get:
 *     summary: Xem chi tiết một đơn đặt sân
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đơn hàng
 */
router.get('/bookings/:id', getBookingById);

/**
 * @swagger
 * /api/users/bookings/{id}/cancel:
 *   post:
 *     summary: Hủy đơn đặt sân (nếu chưa quá hạn)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancel_reason: { type: string }
 *     responses:
 *       200:
 *         description: Hủy thành công
 */
router.post('/bookings/:id/cancel', cancelBooking);
router.post('/bookings/:id/payment', processPayment);
router.put('/bookings/:id/apply-voucher', applyVoucherToBooking);

/**
 * @swagger
 * /api/users/reviews:
 *   post:
 *     summary: Gửi đánh giá cho cụm sân
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cluster_id, rating]
 *             properties:
 *               cluster_id: { type: string }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Gửi đánh giá thành công
 */
router.post('/reviews', createReview);

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Lấy danh sách sân yêu thích
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sân
 *   post:
 *     summary: Thêm sân vào danh sách yêu thích
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [venue_id]
 *             properties:
 *               venue_id: { type: string }
 *     responses:
 *       200:
 *         description: Thêm thành công
 */
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);

/**
 * @swagger
 * /api/users/favorites/{id}:
 *   delete:
 *     summary: Xóa sân khỏi danh sách yêu thích
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/favorites/:id', removeFavorite);

// Vouchers
router.get('/vouchers/venue/:venueId', getVenueVouchers);
router.post('/vouchers/validate', validateVoucher);
router.post('/vouchers/claim', claimVoucher);
router.get('/vouchers/my', getMyVouchers);

module.exports = router;
