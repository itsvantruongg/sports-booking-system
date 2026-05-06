const express = require('express');
const router = express.Router();
const { handlePaymentWebhook, releaseExpiredSlots, generateSlots } = require('../controllers/cron.controller');
const { cronSecret } = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Webhooks and Internal Cron Jobs
 */

/**
 * @swagger
 * /api/webhooks/payment:
 *   post:
 *     summary: Nhận IPN từ cổng thanh toán (MoMo/VNPay)
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Trả về 200 OK cho cổng thanh toán
 */
router.post('/webhooks/payment', handlePaymentWebhook);

/**
 * @swagger
 * /api/cron/release-slots:
 *   post:
 *     summary: Nhả các slot booking đã quá hạn 10 phút chưa thanh toán
 *     tags: [System]
 *     parameters:
 *       - in: header
 *         name: x-cron-secret
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hoàn thành nhả slot
 */
router.post('/cron/release-slots', cronSecret, releaseExpiredSlots);

/**
 * @swagger
 * /api/cron/generate-slots:
 *   post:
 *     summary: Sinh lịch TimeSlots cho 30 ngày tới dựa trên PricingRules
 *     tags: [System]
 *     parameters:
 *       - in: header
 *         name: x-cron-secret
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sinh lịch thành công
 */
router.post('/cron/generate-slots', cronSecret, generateSlots);

module.exports = router;
