const cron = require('node-cron');
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');

const startCronJobs = () => {
  // Chạy mỗi phút: Hủy các Booking chưa thanh toán quá 10 phút
  cron.schedule('* * * * *', async () => {
    try {
      const expiredBookings = await Booking.find({
        status: 'PENDING',
        expires_at: { $lte: new Date() }
      });

      for (let booking of expiredBookings) {
        booking.status = 'CANCELLED';
        booking.cancel_reason = 'Quá hạn thanh toán 10 phút';
        await booking.save();

        // Mở khóa lại các TimeSlots
        const slotIds = booking.booked_slots.map(s => s.time_slot_id);
        await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });
      }
      
      if (expiredBookings.length > 0) {
        console.log(`[Cron] Đã hủy ${expiredBookings.length} booking quá hạn.`);
      }
    } catch (error) {
      console.error('[Cron] Lỗi khi quét expired bookings:', error);
    }
  });

  // Chạy lúc 00:00 mỗi ngày: Sinh lịch tự động cho 7 ngày tới (Bản demo 7 ngày để tránh đầy DB)
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Đang sinh lịch tự động...');
    try {
      const courts = await require('../models/Court').find({ status: 'ACTIVE' });
      const PricingRule = require('../models/PricingRule');
      const TimeSlot = require('../models/TimeSlot');

      for (let court of courts) {
        const rules = await PricingRule.find({ court_id: court._id });
        if (rules.length === 0) continue;

        // Sinh lịch cho 7 ngày tới
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          date.setHours(0, 0, 0, 0);

          for (let rule of rules) {
            // Kiểm tra xem slot này đã tồn tại chưa
            const exists = await TimeSlot.findOne({
              court_id: court._id,
              slot_date: date,
              start_time: rule.slot_start
            });

            if (!exists) {
              await TimeSlot.create({
                court_id: court._id,
                slot_date: date,
                start_time: rule.slot_start,
                end_time: rule.slot_end,
                price: rule.price_per_slot,
                status: 'AVAILABLE'
              });
            }
          }
        }
      }
      console.log('[Cron] Hoàn tất sinh lịch tự động.');
    } catch (error) {
      console.error('[Cron] Lỗi sinh lịch:', error);
    }
  });
};

module.exports = startCronJobs;