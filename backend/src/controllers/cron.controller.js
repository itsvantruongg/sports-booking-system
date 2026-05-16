const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Court = require('../models/Court');
const VenueCluster = require('../models/VenueCluster');
const PricingRule = require('../models/PricingRule');
const SlotGenerationLog = require('../models/SlotGenerationLog');
const Notification = require('../models/Notification');
const { sendZaloNotification } = require('../utils/zaloService');

// POST /api/webhooks/payment — Nhận IPN từ MoMo/VNPay
const handlePaymentWebhook = async (req, res) => {
  try {
    // Xác thực chữ ký (Signature Verify) — placeholder, tuỳ cổng TT
    // const isValid = verifySignature(req.body, process.env.PAYMENT_SECRET_KEY);
    // if (!isValid) return res.status(401).json({ message: 'Invalid signature' });

    const { booking_id, payment_status, transaction_id } = req.body;
    if (!booking_id || !payment_status) {
      return res.status(400).json({ message: 'Thiếu dữ liệu webhook' });
    }

    const booking = await Booking.findById(booking_id)
      .populate({
        path: 'court_id',
        populate: { 
          path: 'cluster_id', 
          populate: { path: 'owner_id', select: 'name phone email' }
        }
      })
      .populate('user_id', 'name phone');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (payment_status === 'SUCCESS' && booking.payment_status === 'PENDING') {
      booking.payment_status = 'PAID';
      booking.status = 'CONFIRMED';
      await booking.save();

      // Tạo thông báo cho chủ sân
      const ownerId = booking.court_id?.cluster_id?.owner_id;
        if (ownerId) {
          await Notification.create({
            user_id: ownerId,
            actor_id: booking.user_id,
            type: 'NEW_BOOKING',
            title: 'Đơn đặt sân mới!',
            body: `Sân "${booking.court_id.name}" có khách đặt vào ${booking.booking_date.toLocaleDateString('vi-VN')}`,
            payload: { booking_id: booking._id },
          });

          // 1b. Thông báo Real-time qua Socket.io
          const io = req.app.get('io');
          if (io) {
            io.to(ownerId.toString()).emit('new_notification', {
              title: 'Đơn đặt sân mới!',
              message: `Sân "${booking.court_id.name}" có khách vừa thanh toán thành công.`
            });
          }
        }
   // 2. Thông báo qua Zalo (Gửi cho Chủ sân)
        const owner = booking.court_id.cluster_id.owner_id;
        if (owner && owner.phone) {
          sendZaloNotification(owner.phone, {
            text: `[KINETIC] Thanh toán thành công: Khách ${booking.user_id.name} đã thanh toán đơn ${booking._id.toString().slice(-6)}. Tổng tiền: ${booking.total_price.toLocaleString('vi-VN')}đ.`
          }).catch(err => console.error('[Zalo Notify Owner Error]', err));
        }

        if (booking.user_id.phone) {
          sendZaloNotification(booking.user_id.phone, {
            text: `[KINETIC] Thanh toán đơn đặt sân ${booking._id.toString().slice(-6)} thành công. Hẹn gặp bạn tại ${booking.court_id.name}!`
          }).catch(err => console.error('[Zalo Notify User Error]', err));
        }
      } else if (payment_status === 'FAILED') {
      // Nhả slot nếu thanh toán thất bại
      const slotIds = booking.booked_slots.map(s => s.time_slot_id);
      await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });
      booking.status = 'CANCELLED';
      booking.cancel_reason = 'Thanh toán thất bại';
      await booking.save();
    }

    // Phải trả 200 OK cho cổng thanh toán, dù gì cũng vậy
    res.status(200).json({ message: 'IPN received' });
  } catch (error) {
    console.error('[Webhook Error]', error);
    res.status(200).json({ message: 'IPN received with error' }); // vẫn 200 để cổng TT không retry
  }
};

// POST /api/cron/release-slots — Nhả slot quá hạn (Chạy mỗi 1 phút)
const releaseExpiredSlots = async (req, res) => {
  try {
    const now = new Date();
    const expiredBookings = await Booking.find({
      status: 'PENDING',
      payment_status: 'PENDING',
      expires_at: { $lt: now },
    });

    let released_count = 0;
    for (const booking of expiredBookings) {
      const slotIds = booking.booked_slots.map(s => s.time_slot_id);
      await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });
      booking.status = 'CANCELLED';
      booking.cancel_reason = 'Hết thời gian giữ chỗ (10 phút)';
      await booking.save();
      released_count++;
    }

    console.log(`[Cron] Đã nhả ${released_count} booking hết hạn`);
    res.status(200).json({ message: 'Done', released_count });
  } catch (error) {
    console.error('[Cron Error]', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/cron/generate-slots — Sinh lịch tự động (Chạy lúc 12h đêm)
const generateSlots = async (req, res) => {
  try {
    const courts = await Court.find({ status: 'ACTIVE' });
    let generated_count = 0;

    for (const court of courts) {
      // Kiểm tra đã sinh đến ngày nào
      let log = await SlotGenerationLog.findOne({ court_id: court._id });
      const generatedUpTo = log?.generated_up_to || new Date();

      const rules = await PricingRule.find({ court_id: court._id });
      if (!rules.length) continue;

      // Sinh lịch cho 30 ngày tới
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);

      const current = new Date(generatedUpTo);
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);

      while (current <= targetDate) {
        const dayOfWeek = current.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const applicableRules = rules.filter(r =>
          (isWeekend && r.day_type === 'WEEKEND') ||
          (!isWeekend && r.day_type === 'WEEKDAY')
        );

        for (const rule of applicableRules) {
          const exists = await TimeSlot.findOne({
            court_id: court._id,
            slot_date: new Date(current),
            start_time: rule.slot_start,
          });
          if (!exists) {
            await TimeSlot.create({
              court_id: court._id,
              slot_date: new Date(current),
              start_time: rule.slot_start,
              end_time: rule.slot_end,
              price: rule.price_per_slot,
              status: 'AVAILABLE',
            });
            generated_count++;
          }
        }
        current.setDate(current.getDate() + 1);
      }

      // Cập nhật log
      await SlotGenerationLog.findOneAndUpdate(
        { court_id: court._id },
        { court_id: court._id, generated_up_to: targetDate, run_at: new Date() },
        { upsert: true }
      );
    }

    console.log(`[Cron] Đã sinh ${generated_count} slots`);
    res.status(200).json({ message: 'Done', generated_count });
  } catch (error) {
    console.error('[Cron Error]', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handlePaymentWebhook, releaseExpiredSlots, generateSlots };
