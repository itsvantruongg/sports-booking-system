const express = require('express');
const router = express.Router();
const {
  getOwnerDashboard, updateVenue, getOwnerCourts,
  createPricingRule, getOwnerTimeSlots, blockSlots,
  getOwnerBookings, getOwnerReport
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
 *     security: [{ bearerAuth: [] }]
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
 * /api/owner/venues/{id}:
 *   put:
 *     summary: Cập nhật thông tin cụm sân (mô tả, tiện ích, hình ảnh)
 *     tags: [Owner]
 *     security: [{ bearerAuth: [] }]
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
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: cluster_id
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách sân con
 */
router.get('/courts', getOwnerCourts);

/**
 * @swagger
 * /api/owner/pricing-rules:
 *   post:
 *     summary: Tạo quy tắc giá mới cho sân
 *     tags: [Owner]
 *     security: [{ bearerAuth: [] }]
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

/**
 * @swagger
 * /api/owner/time-slots:
 *   get:
 *     summary: Xem timeline lịch sân (TimeSlots) theo ngày
 *     tags: [Owner]
 *     security: [{ bearerAuth: [] }]
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
 *     security: [{ bearerAuth: [] }]
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

/**
 * @swagger
 * /api/owner/bookings:
 *   get:
 *     summary: Quản lý danh sách đơn đặt sân tại các sân của mình
 *     tags: [Owner]
 *     security: [{ bearerAuth: [] }]
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

/**
 * @swagger
 * /api/owner/reports:
 *   get:
 *     summary: Báo cáo doanh thu chi tiết theo tháng
 *     tags: [Owner]
 *     security: [{ bearerAuth: [] }]
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

module.exports = router;
