const express = require('express');
const router = express.Router();
const { register, login, refresh, forceChangePassword, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Authorization
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về access_token và lưu refresh_token vào cookie
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới access token bằng refresh token (từ cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Trả về access_token mới
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/force-change:
 *   post:
 *     summary: Đổi mật khẩu lần đầu (bắt buộc cho OWNER)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [old_password, new_password]
 *             properties:
 *               old_password: { type: string }
 *               new_password: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
router.post('/force-change', protect, forceChangePassword);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Yêu cầu đặt lại mật khẩu (Gửi email)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Email đã được gửi
 *       404:
 *         description: Không tìm thấy email
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu bằng token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       400:
 *         description: Token không hợp lệ hoặc hết hạn
 */
router.post('/reset-password', resetPassword);

module.exports = router;
