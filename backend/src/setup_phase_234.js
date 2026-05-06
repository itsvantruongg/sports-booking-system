const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const routesDir = path.join(__dirname, 'routes');
const servicesDir = path.join(__dirname, 'services');

[controllersDir, routesDir, servicesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  // ================= CHẶNG 2: PRICING & TIMESLOTS =================
  'controllers/pricing.controller.js': `
const PricingRule = require('../models/PricingRule');
const SpecialDay = require('../models/SpecialDay');
const Court = require('../models/Court');
const VenueCluster = require('../models/VenueCluster');

const createPricingRule = async (req, res) => {
  try {
    const { court_id, day_type, slot_start, slot_end, price_per_slot, label } = req.body;
    
    // Check ownership
    const court = await Court.findById(court_id).populate('cluster_id');
    if (!court || court.cluster_id.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền truy cập sân này' });
    }

    const rule = await PricingRule.create({
      court_id, day_type, slot_start, slot_end, price_per_slot, label
    });
    res.status(201).json(rule);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createSpecialDay = async (req, res) => {
  try {
    const { calendar_date, name } = req.body;
    const specialDay = await SpecialDay.create({
      calendar_date, name, day_type: 'HOLIDAY', created_by: req.user._id
    });
    res.status(201).json(specialDay);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { createPricingRule, createSpecialDay };
`,

  'routes/pricing.routes.js': `
const express = require('express');
const router = express.Router();
const { createPricingRule, createSpecialDay } = require('../controllers/pricing.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/rules', protect, authorize('OWNER'), createPricingRule);
router.post('/special-days', protect, authorize('OWNER'), createSpecialDay);

module.exports = router;
`,

  // ================= CHẶNG 3: BOOKING =================
  'controllers/booking.controller.js': `
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');

const getAvailableSlots = async (req, res) => {
  try {
    const { court_id, date } = req.query;
    const slots = await TimeSlot.find({
      court_id,
      slot_date: new Date(date),
      status: 'AVAILABLE'
    }).sort('start_time');
    res.status(200).json(slots);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createBooking = async (req, res) => {
  try {
    const { court_id, time_slot_ids, payment_method } = req.body;
    
    // 1. Lấy và khóa các slots
    const slots = await TimeSlot.find({ _id: { $in: time_slot_ids }, status: 'AVAILABLE' });
    if (slots.length !== time_slot_ids.length) {
      return res.status(400).json({ message: 'Một số khung giờ đã bị đặt, vui lòng chọn lại' });
    }

    let subtotal = 0;
    const booked_slots = slots.map(slot => {
      subtotal += slot.price;
      return { time_slot_id: slot._id, slot_price: slot.price };
    });

    const platform_fee = subtotal * 0.05; // 5% fee
    const total_price = subtotal + platform_fee;
    
    // Set hết hạn sau 10 phút
    const expires_at = new Date(Date.now() + 10 * 60000);

    const booking = await Booking.create({
      user_id: req.user._id,
      court_id,
      booking_date: slots[0].slot_date,
      start_time: slots[0].start_time,
      end_time: slots[slots.length - 1].end_time,
      slot_count: slots.length,
      subtotal,
      platform_fee,
      total_price,
      payment_method,
      expires_at,
      booked_slots
    });

    // Khóa slots lại để người khác không đặt được
    await TimeSlot.updateMany({ _id: { $in: time_slot_ids } }, { status: 'BOOKED' });

    res.status(201).json(booking);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const confirmPayment = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await Booking.findById(booking_id);
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'CANCELLED') return res.status(400).json({ message: 'Booking đã bị hủy' });

    booking.payment_status = 'PAID';
    booking.status = 'CONFIRMED';
    await booking.save();

    res.status(200).json({ message: 'Thanh toán thành công', booking });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getAvailableSlots, createBooking, confirmPayment };
`,

  'routes/booking.routes.js': `
const express = require('express');
const router = express.Router();
const { getAvailableSlots, createBooking, confirmPayment } = require('../controllers/booking.controller');
const { protect } = require('../middlewares/authMiddleware');

router.get('/slots', getAvailableSlots);
router.post('/', protect, createBooking);
router.post('/:booking_id/pay', protect, confirmPayment);

module.exports = router;
`,

  // ================= CRONJOB TỰ ĐỘNG =================
  'services/cron.service.js': `
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
        console.log(\`[Cron] Đã hủy \${expiredBookings.length} booking quá hạn.\`);
      }
    } catch (error) {
      console.error('[Cron] Lỗi khi quét expired bookings:', error);
    }
  });

  // Chạy lúc 00:00 mỗi ngày: Sinh lịch tự động (Log logic placeholder)
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Đang sinh lịch tự động cho 30 ngày tới...');
    // Logic đọc PricingRules và SpecialDays sinh TimeSlots
  });
};

module.exports = startCronJobs;
`,
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content.trim());
  console.log('Created:', filepath);
}

// Cập nhật app.js để load Route và Cron
const appJsPath = path.join(__dirname, 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

if (!appJsContent.includes('/api/pricing')) {
  appJsContent = appJsContent.replace(
    "app.use('/api/courts', require('./routes/court.routes'));",
    "app.use('/api/courts', require('./routes/court.routes'));\\napp.use('/api/pricing', require('./routes/pricing.routes'));\\napp.use('/api/bookings', require('./routes/booking.routes'));"
  );
}

if (!appJsContent.includes('startCronJobs')) {
  appJsContent = appJsContent.replace(
    "const specs = swaggerJsDoc(swaggerOptions);",
    "const specs = swaggerJsDoc(swaggerOptions);\\n\\n// Start CronJobs\\nconst startCronJobs = require('./services/cron.service');\\nstartCronJobs();"
  );
}

fs.writeFileSync(appJsPath, appJsContent);
console.log('Updated: app.js');
