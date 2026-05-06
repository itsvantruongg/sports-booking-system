const express = require('express');
const router = express.Router();
const {
  getAdminDashboard, createOwner, getAllUsers,
  updateUserStatus, getAllVenues, createSportType, updateVenueStatus
} = require('../controllers/admin.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect, authorize('ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Platform Administration APIs (Requires ADMIN Role)
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: "[Dash] Thống kê tổng quan toàn nền tảng"
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Trả về số lượng user, sân và tổng doanh thu phí nền tảng
 */
router.get('/dashboard', getAdminDashboard);

/**
 * @swagger
 * /api/admin/owners:
 *   post:
 *     summary: "[Owner] Tạo tài khoản Owner mới (Chủ sân)"
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, venue_name]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               venue_name: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công, gửi email mật khẩu tạm thời
 */
router.post('/owners', createOwner);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: "[User] Quản lý danh sách người dùng (User & Owner)"
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [USER, OWNER, ADMIN] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   put:
 *     summary: "[User] Khóa/Mở khóa tài khoản người dùng"
 *     tags: [Admin]
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [ACTIVE, BANNED] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/users/:id/status', updateUserStatus);

/**
 * @swagger
 * /api/admin/venues:
 *   get:
 *     summary: "[Venue] Xem danh sách toàn bộ cụm sân trên hệ thống"
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, INACTIVE, BANNED] }
 *     responses:
 *       200:
 *         description: Danh sách cụm sân
 */
router.get('/venues', getAllVenues);

/**
 * @swagger
 * /api/admin/sport-types:
 *   post:
 *     summary: "[Config] Thêm loại hình môn thể thao mới (vd: Pickleball)"
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               icon_url: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/sport-types', createSportType);

/**
 * @swagger
 * /api/admin/venues/{id}/status:
 *   put:
 *     summary: "[Venue] Khóa/Mở khóa cụm sân"
 *     tags: [Admin]
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [ACTIVE, INACTIVE, BANNED] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/venues/:id/status', updateVenueStatus);

module.exports = router;
