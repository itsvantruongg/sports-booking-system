const cron = require('node-cron');
const Court = require('../models/Court');
const PricingRule = require('../models/PricingRule');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');

/**
 * Hàm sinh lịch cho một sân cụ thể trong một khoảng ngày
 */
const generateSlotsForCourt = async (courtId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const defaultIntervals = [
    { start: '06:00', end: '08:00' },
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' },
    { start: '18:00', end: '20:00' },
    { start: '20:00', end: '22:00' }
  ];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayType = [0, 6].includes(d.getDay()) ? 'WEEKEND' : 'WEEKDAY';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const slotDate = new Date(dateStr + "T00:00:00.000Z");

    const rules = await PricingRule.find({ court_id: courtId, day_type: dayType });
    const targetSlots = [...defaultIntervals];

    for (const rule of rules) {
      const normStart = rule.slot_start.includes(':') && rule.slot_start.length === 4 ? '0' + rule.slot_start : rule.slot_start;
      const isDefault = defaultIntervals.some(i => i.start === normStart);
      if (!isDefault) targetSlots.push({ start: normStart, end: rule.slot_end });
    }

    // TỐI ƯU: Sử dụng bulkWrite để giảm số lần gọi Database
    const ops = [];
    const existingSlots = await TimeSlot.find({ court_id: courtId, slot_date: slotDate });

    for (const target of targetSlots) {
      const rule = rules.find(r => {
        const rs = r.slot_start.includes(':') && r.slot_start.length === 4 ? '0' + r.slot_start : r.slot_start;
        return rs === target.start;
      });

      const existing = existingSlots.find(s => s.start_time === target.start);
      ops.push({
        updateOne: {
          filter: { court_id: courtId, slot_date: slotDate, start_time: target.start },
          update: {
            $set: {
              end_time: rule ? rule.slot_end : target.end,
              price: rule ? rule.price_per_slot : 100000,
              label: rule ? rule.label : 'Giá mặc định',
            },
            $setOnInsert: { status: 'AVAILABLE' }
          },
          upsert: true
        }
      });
    }

    if (ops.length > 0) {
      await TimeSlot.bulkWrite(ops);
    }
  }
  console.log(`[Cron] Bulk generated/updated slots for Court ${courtId}`);
};

/**
 * Tác vụ tự động chạy
 */
const initCronJobs = async () => {
  console.log('--- SYSTEM BACKGROUND TASKS INITIALIZING ---');

  try {
    // 1. Tự động hoàn thành các đơn đã qua giờ & Sửa lỗi slot mồ côi (Chạy mỗi khi khởi động)
    await autoCompleteBookings();

    // 2. Lập lịch quét tự động mỗi 30 phút
    cron.schedule('*/30 * * * *', async () => {
      await autoCompleteBookings();
    });

    // 3. Lập lịch chạy hàng đêm lúc 00:01 để sinh lịch cho ngày thứ 30 kể từ hôm nay
    cron.schedule('1 0 * * *', async () => {
      console.log('--- STARTING NIGHTLY SLOT PRE-GENERATION ---');
      try {
        const courts = await Court.find({ status: 'ACTIVE' });
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);

        const y = futureDate.getFullYear();
        const m = String(futureDate.getMonth() + 1).padStart(2, '0');
        const d = String(futureDate.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        for (const court of courts) {
          await generateSlotsForCourt(court._id, dateStr, dateStr);
        }
        console.log(`--- NIGHTLY SLOT GENERATION COMPLETED FOR DATE: ${dateStr} ---`);
      } catch (err) {
        console.error('--- NIGHTLY SLOT GENERATION FAILED ---', err);
      }
    });

    console.log('✅ Cron Jobs initialized: Background tasks are active.');
  } catch (error) {
    console.error('❌ Failed to initialize Cron Jobs:', error);
  }
};

/**
 * Logic tự động hoàn thành đơn hàng
 */
const autoCompleteBookings = async () => {
  console.log('--- STARTING AUTO-COMPLETE & EXPIRE CHECK ---');
  try {
    const now = new Date();
    // 1. Chuyển CONFIRMED sang COMPLETED
    const confirmed = await Booking.find({ status: 'CONFIRMED' });
    let completedCount = 0;
    for (const booking of confirmed) {
      const [hours, minutes] = booking.end_time.split(':').map(Number);
      const bookingEndTime = new Date(booking.booking_date);
      bookingEndTime.setHours(hours, minutes, 0, 0);

      if (now > bookingEndTime) {
        booking.status = 'COMPLETED';
        await booking.save();
        completedCount++;
      }
    }

    // 2. Chuyển PENDING quá hạn sang CANCELLED
    const pending = await Booking.find({ status: 'PENDING' });
    let expiredCount = 0;
    for (const booking of pending) {
      const [hours, minutes] = booking.start_time.split(':').map(Number);
      const bookingStartTime = new Date(booking.booking_date);
      bookingStartTime.setHours(hours, minutes, 0, 0);

      const isOverTime = now > bookingStartTime;
      const isExpired = booking.expires_at && now > booking.expires_at;

      // Không tự động hủy đơn BANKING do quá giờ (vì chủ sân cần thời gian duyệt)
      // Chỉ hủy nếu nó thực sự hết hạn 10p (nếu chưa chọn phương thức) hoặc quá giờ mà chưa chọn gì
      const isManualPayment = ['BANKING', 'CASH'].includes(booking.payment_method);
      
      if ((isOverTime && !isManualPayment) || isExpired) {
        booking.status = 'CANCELLED';
        booking.cancel_reason = isOverTime
          ? 'Hệ thống tự động hủy do quá giờ xác nhận'
          : 'Hệ thống tự động hủy do hết thời gian thanh toán (10 phút)';
        await booking.save();

        // QUAN TRỌNG: Giải phóng slot
        if (booking.booked_slots && booking.booked_slots.length > 0) {
          const slotIds = booking.booked_slots.map(s => s.time_slot_id);
          await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });
          console.log(`[Cron] Đã giải phóng ${slotIds.length} slots cho đơn ${booking._id}`);
        }

        expiredCount++;
      }
    }

    // 3. Cơ chế tự sửa lỗi: Tìm các đơn đã CANCELLED nhưng slot vẫn bị BOOKED
    const cancelledButLocked = await Booking.find({
      status: 'CANCELLED',
      updated_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Kiểm tra trong 24h qua
    });

    for (const b of cancelledButLocked) {
      if (b.booked_slots && b.booked_slots.length > 0) {
        const slotIds = b.booked_slots.map(s => s.time_slot_id);
        const lockedSlots = await TimeSlot.find({ _id: { $in: slotIds }, status: 'BOOKED' });
        if (lockedSlots.length > 0) {
          console.log(`[Cron] Fixing orphaned slots for cancelled booking ${b._id}`);
          await TimeSlot.updateMany({ _id: { $in: slotIds } }, { status: 'AVAILABLE' });
        }
      }
    }

    console.log(`--- CHECK FINISHED: ${completedCount} Completed, ${expiredCount} Expired ---`);
  } catch (error) {
    console.error('--- AUTO-COMPLETE FAILED ---', error);
  }
};

module.exports = { initCronJobs, generateSlotsForCourt };
