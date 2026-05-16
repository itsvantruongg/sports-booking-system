const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/authMiddleware');

// Public endpoints (for VNPay callback)
router.get('/vnpay-return', paymentController.vnpayReturn);
router.get('/vnpay-ipn', paymentController.vnpayIpn);
router.get('/methods/:bookingId', paymentController.getAvailableMethods);

// Protected endpoints
router.post('/create-vnpay-url', protect, paymentController.createVNPayUrl);

module.exports = router;
