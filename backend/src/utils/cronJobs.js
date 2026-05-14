const cron = require('node-cron');
const Court = require('../models/Court');
const PricingRule = require('../models/PricingRule');
const TimeSlot = require('../models/TimeSlot');

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

    // Sửa lỗi: toISOString() có thể làm lệch ngày nếu ở múi giờ GMT+7
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const slotDate = new Date(dateStr + "T00:00:00.000Z");

    console.log(`[Cron] Processing ${courtId} for ${dateStr} (${dayType})`);

    const rules = await PricingRule.find({ court_id: courtId, day_type: dayType });

    const targetSlots = [...defaultIntervals];

    for (const rule of rules) {
      // Chuẩn hóa giờ (VD: 6:00 -> 06:00)
      const normStart = rule.slot_start.includes(':') && rule.slot_start.length === 4 ? '0' + rule.slot_start : rule.slot_start;
      const isDefault = defaultIntervals.some(i => i.start === normStart);
      if (!isDefault) {
        targetSlots.push({ start: normStart, end: rule.slot_end });
      }
    }

    for (const target of targetSlots) {
      const rule = rules.find(r => {
        const rs = r.slot_start.includes(':') && r.slot_start.length === 4 ? '0' + r.slot_start : r.slot_start;
        return rs === target.start;
      });

      const slotData = {
        end_time: rule ? rule.slot_end : target.end,
        price: rule ? rule.price_per_slot : 100000,
        label: rule ? rule.label : 'Giá mặc định',
      };

      // Tìm slot hiện có để giữ nguyên status (tránh ghi đè BOOKED thành AVAILABLE)
      const existing = await TimeSlot.findOne({ court_id: courtId, slot_date: slotDate, start_time: target.start });
      const status = existing ? existing.status : 'AVAILABLE';

      await TimeSlot.findOneAndUpdate(
        { court_id: courtId, slot_date: slotDate, start_time: target.start },
        { ...slotData, status },
        { upsert: true, new: true }
      );
    }
  }
  console.log(`[Cron] Finished generation for Court ${courtId}`);
};

/**
 * Tác vụ tự động chạy vào 00:01 mỗi đêm
 * Tự động tạo lịch cho ngày thứ 30 kể từ hôm nay
 * ĐỒNG THỜI: Kiểm tra và bù lịch cho 7 ngày tới nếu còn trống (chạy khi khởi động)
 */
const initCronJobs = async () => {
  // 1. Chạy ngay khi khởi động: Kiểm tra 7 ngày tới
  console.log('--- STARTING STARTUP SLOT CHECK (Next 7 days) ---');
  try {
    const courts = await Court.find({ status: 'ACTIVE' });
    console.log(`Found ${courts.length} ACTIVE courts to process.`);

    for (let i = 0; i <= 7; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0];

      for (const court of courts) {
        await generateSlotsForCourt(court._id, dateStr, dateStr);
      }
    }
    console.log('--- STARTUP SLOT CHECK COMPLETED ---');
  } catch (err) {
    console.error('--- STARTUP SLOT CHECK FAILED ---', err);
  }

  // 1.5 Chạy ngay khi khởi động: Tự động hoàn thành các đơn đã qua giờ
  await autoCompleteBookings();

  // 2. Lập lịch chạy hàng đêm lúc 00:01
  cron.schedule('1 0 * * *', async () => {
    console.log('--- STARTING AUTO SLOT GENERATION ---');
    try {
      const courts = await Court.find({ status: 'ACTIVE' });
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const dateStr = futureDate.toISOString().split('T')[0];

      for (const court of courts) {
        await generateSlotsForCourt(court._id, dateStr, dateStr);
      }
      console.log(`--- AUTO GENERATION SUCCESS FOR DATE: ${dateStr} ---`);
    } catch (error) {
      console.error('--- AUTO GENERATION FAILED ---', error);
    }
  });

  // 3. Tác vụ tự động hoàn thành đơn đặt sân (Chạy mỗi 30 phút)
  cron.schedule('*/30 * * * *', async () => {
    await autoCompleteBookings();
  });

  console.log('Cron Jobs initialized: Automated slot generation and auto-completion active.');
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

      if (isOverTime || isExpired) {
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

const Booking = require('../models/Booking');
module.exports = { initCronJobs, generateSlotsForCourt };
