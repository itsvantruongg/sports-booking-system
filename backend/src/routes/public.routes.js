const express = require('express');
const router = express.Router();
const { getSportTypes, getPublicVenues, getVenueDetail, getCourtTimeSlots } = require('../controllers/public.controller');
const { submitPartnership } = require('../controllers/partnership.controller');

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Publicly accessible endpoints (No Auth)
 */

/**
 * @swagger
 * /api/public/partnerships:
 *   post:
 *     summary: Gửi yêu cầu hợp tác dành cho chủ sân
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, fieldName, email]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               fieldName: { type: string }
 *               email: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Gửi yêu cầu thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/partnerships', submitPartnership);

/**
 * @swagger
 * /api/public/sport-types:
 *   get:
 *     summary: Lấy danh sách các môn thể thao đang hoạt động
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Trả về mảng các SportType
 */
router.get('/sport-types', getSportTypes);

/**
 * @swagger
 * /api/public/venues:
 *   get:
 *     summary: Tìm kiếm cụm sân (Venues) kèm lọc theo thành phố, quận, môn thể thao
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: sport
 *         schema: { type: string }
 *         description: ID môn thể thao
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: district
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: Trả về danh sách cụm sân kèm rating trung bình
 */
router.get('/venues', getPublicVenues);

/**
 * @swagger
 * /api/public/venues/{id}:
 *   get:
 *     summary: Lấy chi tiết cụm sân kèm danh sách sân con và reviews
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết cụm sân
 */
router.get('/venues/:id', getVenueDetail);

/**
 * @swagger
 * /api/public/courts/{id}/time-slots:
 *   get:
 *     summary: Lấy lịch trống của một sân vào ngày cụ thể
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *         description: Định dạng YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Danh sách các slots trống
 */
router.get('/courts/:id/time-slots', getCourtTimeSlots);

module.exports = router;
