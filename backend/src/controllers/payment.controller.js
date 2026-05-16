const PaymentConfig = require('../models/PaymentConfig');
const Booking = require('../models/Booking');
const Court = require('../models/Court'); // Cần thiết để populate hoạt động
const VenueCluster = require('../models/VenueCluster'); // Cần thiết để populate hoạt động
const { createPaymentUrl, verifyReturnData } = require('../utils/vnpay');
const Notification = require('../models/Notification');
const { sendZaloNotification } = require('../utils/zaloService');

// POST /api/payments/create-vnpay-url
const createVNPayUrl = async (req, res) => {
    try {
        const { booking_id, bankCode } = req.body;
        const booking = await Booking.findById(booking_id).populate({
            path: 'court_id',
            populate: { path: 'cluster_id' }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đơn đặt sân' });
        }

        const ownerId = booking.court_id.cluster_id.owner_id;
        const config = await PaymentConfig.findOne({ owner_id: ownerId });

        if (!config || !config.vnpay?.is_active) {
            return res.status(400).json({ message: 'Chủ sân chưa kích hoạt thanh toán VNPay' });
        }

        const paymentUrl = createPaymentUrl(req, {
            bookingId: booking._id.toString(),
            amount: booking.total_price,
            bankCode,
            vnpTmnCode: config.vnpay.tmn_code,
            vnpHashSecret: config.vnpay.hash_secret
        });

        res.status(200).json({ paymentUrl });
    } catch (error) {
        console.error('[VNPay Error]', error);
        res.status(500).json({ message: error.message });
    }
};

// GET /api/payments/vnpay-return
const vnpayReturn = async (req, res) => {
    try {
        const vnp_Params = req.query;
        const bookingId = vnp_Params['vnp_TxnRef'];
        
        const booking = await Booking.findById(bookingId).populate({
            path: 'court_id',
            populate: { path: 'cluster_id' }
        });
        
        if (!booking) return res.redirect(`${process.env.CLIENT_URL}/user/history?status=error`);

        const config = await PaymentConfig.findOne({ owner_id: booking.court_id.cluster_id.owner_id });
        const isValid = verifyReturnData(vnp_Params, config?.vnpay?.hash_secret);

        if (isValid) {
            const responseCode = vnp_Params['vnp_ResponseCode'];
            if (responseCode === '00') {
                return res.redirect(`${process.env.CLIENT_URL}/user/history?status=success&bookingId=${bookingId}`);
            } else {
                return res.redirect(`${process.env.CLIENT_URL}/user/history?status=failed&bookingId=${bookingId}`);
            }
        } else {
            return res.redirect(`${process.env.CLIENT_URL}/user/history?status=error`);
        }
    } catch (error) {
        console.error('[VNPay Return Error]', error);
        res.redirect(`${process.env.CLIENT_URL}/user/history?status=error`);
    }
};

// GET /api/payments/vnpay-ipn
const vnpayIpn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        const bookingId = vnp_Params['vnp_TxnRef'];
        
        const booking = await Booking.findById(bookingId).populate({
            path: 'court_id',
            populate: { 
                path: 'cluster_id',
                populate: { path: 'owner_id', select: 'name phone email' }
            }
        }).populate('user_id', 'name phone');
        
        if (!booking) return res.status(200).json({ RspCode: '01', Message: 'Order not found' });

        const config = await PaymentConfig.findOne({ owner_id: booking.court_id.cluster_id.owner_id });
        const isValid = verifyReturnData(vnp_Params, config?.vnpay?.hash_secret);

        if (isValid) {
            const responseCode = vnp_Params['vnp_ResponseCode'];
            const amount = vnp_Params['vnp_Amount'] / 100;

            if (booking.total_price !== amount) {
                return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
            }

            if (booking.payment_status !== 'PENDING') {
                return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
            }

            if (responseCode === '00') {
                booking.payment_status = 'PAID';
                booking.status = 'CONFIRMED';
                booking.payment_method = 'VNPAY';
                await booking.save();

                // Thông báo cho chủ sân
                const owner = booking.court_id.cluster_id.owner_id;
                
                // 1. Thông báo qua In-app
                await Notification.create({
                    user_id: owner._id,
                    actor_id: booking.user_id._id,
                    type: 'NEW_BOOKING_PAID',
                    title: 'Thanh toán VNPay mới',
                    body: `Đơn đặt sân ${booking._id.toString().slice(-6)} đã thanh toán thành công qua VNPay.`,
                    payload: { booking_id: booking._id }
                });
 
                // 1b. Thông báo Real-time qua Socket.io
                const io = req.app.get('io');
                if (io) {
                    io.to(owner._id.toString()).emit('new_notification', {
                        title: 'Thanh toán VNPay mới',
                        message: `Đơn đặt sân ${booking._id.toString().slice(-6)} đã thanh toán thành công qua VNPay.`
                    });
                }

                // 2. Thông báo qua Zalo
                if (owner.phone) {
                    sendZaloNotification(owner.phone, {
                        text: `[KINETIC] Khách ${booking.user_id.name} vừa thanh toán thành công đơn đặt sân ${booking._id.toString().slice(-6)}. Tổng tiền: ${booking.total_price.toLocaleString('vi-VN')}đ.`
                    }).catch(err => console.error('[Zalo Notify Owner Error]', err));
                }

                if (booking.user_id.phone) {
                    sendZaloNotification(booking.user_id.phone, {
                        text: `[KINETIC] Chúc mừng! Thanh toán đơn ${booking._id.toString().slice(-6)} tại ${booking.court_id.name} thành công. Chúc bạn có những giờ phút chơi thể thao vui vẻ!`
                    }).catch(err => console.error('[Zalo Notify User Error]', err));
                }

                return res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
                return res.status(200).json({ RspCode: '00', Message: 'Success' });
            }
        } else {
            return res.status(200).json({ RspCode: '97', Message: 'Invalid checksum' });
        }
    } catch (error) {
        console.error('[VNPay IPN Error]', error);
        res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
};

// GET /api/payments/methods/:bookingId
const getAvailableMethods = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId).populate({
            path: 'court_id',
            populate: { path: 'cluster_id' }
        });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const config = await PaymentConfig.findOne({ owner_id: booking.court_id.cluster_id.owner_id });
        
        const methods = [
            { id: 'CASH', label: 'Tiền mặt', icon: 'payments', desc: 'Thanh toán tại sân', is_active: true }
        ];

        if (config) {
            if (config.vnpay?.is_active) methods.push({ id: 'VNPAY', label: 'VNPay', icon: 'account_balance', desc: 'Thanh toán qua VNPay', is_active: true });
            if (config.momo?.is_active) methods.push({ id: 'MOMO', label: 'MoMo', icon: 'wallet', desc: 'Ví điện tử MoMo', is_active: true });
            if (config.payos?.is_active) methods.push({ id: 'PAYOS', label: 'PayOS', icon: 'sync_alt', desc: 'Chuyển khoản VietQR', is_active: true });
            if (config.banking?.is_active) methods.push({ id: 'BANKING', label: 'Chuyển khoản', icon: 'account_balance', desc: 'Chuyển khoản ngân hàng', is_active: true, info: config.banking });
        }

        res.status(200).json(methods);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
    createVNPayUrl,
    vnpayReturn,
    vnpayIpn,
    getAvailableMethods
};
