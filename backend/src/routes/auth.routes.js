const express = require('express');
const router = express.Router();
const { register, login, refresh, forceChangePassword } = require('../controllers/auth.controller');
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

module.exports = router;
