const express = require('express');
const router = express.Router();
const {
  getOwnerDashboard, getOwnerVenues, updateVenue, getOwnerCourts, createCourt, updateCourt,
  createPricingRule, getOwnerTimeSlots, blockSlots,
  getOwnerBookings, updateBookingStatus, getOwnerReport, getOwnerCustomers,
  generateSlots, getPricingRules, deletePricingRule, confirmBookingPayment,
  updatePricingRule, bulkCreatePricingRules, unblockSlots,
  getPaymentConfig, updatePaymentConfig,
  createVoucher, getVouchers, deleteVoucher
} = require('../controllers/owner.controller');
const { protect, checkMustChangePassword } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Tất cả routes owner phải đăng nhập, đúng role, và đã đổi mật khẩu
router.use(protect, authorize('OWNER'), checkMustChangePassword);

/**
 * @swagger
 * tags:
 *   name: Owner
 *   description: Management APIs for Sport Venue Owners (Requires OWNER Role)
 */

/**
 * @swagger
 * /api/owner/dashboard:
 *   get:
 *     summary: Lấy dữ liệu tổng quan trang Dashboard
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema: { type: string, enum: [today, week] }
 *     responses:
 *       200:
 *         description: Trả về doanh thu và tỷ lệ lấp đầy
 */
router.get('/dashboard', getOwnerDashboard);

/**
 * @swagger
 * /api/owner/venues:
 *   get:
 *     summary: Lấy danh sách các cụm sân của Owner
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách cụm sân
 */
router.get('/venues', getOwnerVenues);

/**
 * @swagger
 * /api/owner/venues/{id}:
 *   put:
 *     summary: Cập nhật thông tin cụm sân (mô tả, tiện ích, hình ảnh)
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description: { type: string }
 *               amenities: { type: array, items: { type: string } }
 *               images: { type: array, items: { type: object } }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/venues/:id', updateVenue);

/**
 * @swagger
 * /api/owner/courts:
 *   get:
 *     summary: Lấy danh sách các sân con thuộc sở hữu
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cluster_id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách sân con
 */
router.get('/courts', getOwnerCourts);
router.post('/courts', createCourt);
router.put('/courts/:id', updateCourt);

/**
 * @swagger
 * /api/owner/pricing-rules:
 *   post:
 *     summary: Tạo quy tắc giá mới cho sân
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [court_id, day_type, slot_start, slot_end, price_per_slot]
 *             properties:
 *               court_id: { type: string }
 *               day_type: { type: string, enum: [WEEKDAY, WEEKEND] }
 *               slot_start: { type: string, example: "17:00" }
 *               slot_end: { type: string, example: "17:30" }
 *               price_per_slot: { type: number }
 *               label: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/pricing-rules', createPricingRule);
router.post('/pricing-rules/bulk', bulkCreatePricingRules);
router.get('/pricing-rules', getPricingRules);
router.put('/pricing-rules/:id', updatePricingRule);
router.delete('/pricing-rules/:id', deletePricingRule);

/**
 * @swagger
 * /api/owner/time-slots:
 *   get:
 *     summary: Xem timeline lịch sân (TimeSlots) theo ngày
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: cluster_id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách slots
 */
router.get('/time-slots', getOwnerTimeSlots);

/**
 * @swagger
 * /api/owner/time-slots/block:
 *   post:
 *     summary: Khóa slot thủ công (khi có khách đặt ngoài)
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [time_slot_ids]
 *             properties:
 *               time_slot_ids: { type: array, items: { type: string } }
 *               block_reason: { type: string }
 *     responses:
 *       200:
 *         description: Khóa thành công
 */
router.post('/time-slots/block', blockSlots);
router.post('/time-slots/unblock', unblockSlots);
router.post('/time-slots/generate', generateSlots);

/**
 * @swagger
 * /api/owner/bookings:
 *   get:
 *     summary: Quản lý danh sách đơn đặt sân tại các sân của mình
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Danh sách đơn đặt sân
 */
router.get('/bookings', getOwnerBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.put('/bookings/:id/confirm-payment', confirmBookingPayment);

/**
 * @swagger
 * /api/owner/reports:
 *   get:
 *     summary: Báo cáo doanh thu chi tiết theo tháng
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema: { type: integer }
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dữ liệu báo cáo
 */
router.get('/reports', getOwnerReport);

/**
 * @swagger
 * /api/owner/customers:
 *   get:
 *     summary: Lấy danh sách khách hàng đã đặt sân
 *     tags: [Owner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách khách hàng
 */
router.get('/customers', getOwnerCustomers);

/**
 * @swagger
 * /api/owner/payment-config:
 *   get:
 *     summary: Lấy cấu hình thanh toán của Owner
 *     tags: [Owner]
 */
router.get('/payment-config', getPaymentConfig);

/**
 * @swagger
 * /api/owner/payment-config:
 *   put:
 *     summary: Cập nhật cấu hình thanh toán
 *     tags: [Owner]
 */
router.put('/payment-config', updatePaymentConfig);

// Voucher Management
router.post('/vouchers', createVoucher);
router.get('/vouchers', getVouchers);
router.delete('/vouchers/:id', deleteVoucher);

module.exports = router;
