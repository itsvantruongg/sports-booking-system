const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const models = {
  'SportType.js': `const mongoose = require('mongoose');

const sportTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon_url: { type: String },
  is_active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('SportType', sportTypeSchema);
`,

  'VenueCluster.js': `const mongoose = require('mongoose');

const venueClusterSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  description: { type: String },
  amenities: { type: Object }, // JSON object for amenities like { wifi: true, parking: true }
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'BANNED'], default: 'ACTIVE' },
  images: [{
    url: String,
    sort_order: Number
  }] // Bảng venue_cluster_images được nhúng (embed) vào đây để tăng tốc độ truy vấn
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('VenueCluster', venueClusterSchema);
`,

  'Court.js': `const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  cluster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueCluster', required: true },
  sport_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SportType', required: true },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['ACTIVE', 'BLOCKED', 'MAINTENANCE'], default: 'ACTIVE' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Court', courtSchema);
`,

  'PricingRule.js': `const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  day_type: { type: String, enum: ['WEEKDAY', 'WEEKEND', 'HOLIDAY'], required: true },
  slot_start: { type: String, required: true }, // Format: 'HH:mm'
  slot_end: { type: String, required: true },   // Format: 'HH:mm'
  price_per_slot: { type: Number, required: true },
  label: { type: String }, // vd: "Giờ vàng"
  priority: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
`,

  'SpecialDay.js': `const mongoose = require('mongoose');

const specialDaySchema = new mongoose.Schema({
  calendar_date: { type: Date, required: true },
  name: { type: String, required: true },
  day_type: { type: String, enum: ['HOLIDAY'], required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('SpecialDay', specialDaySchema);
`,

  'TimeSlot.js': `const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  slot_date: { type: Date, required: true },
  start_time: { type: String, required: true }, // Format 'HH:mm'
  end_time: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['AVAILABLE', 'BOOKED', 'BLOCKED'], default: 'AVAILABLE' },
  blocked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  block_reason: { type: String },
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
`,

  'SlotGenerationLog.js': `const mongoose = require('mongoose');

const slotGenerationLogSchema = new mongoose.Schema({
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  generated_up_to: { type: Date, required: true },
  run_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SlotGenerationLog', slotGenerationLogSchema);
`,

  'Booking.js': `const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  booking_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  slot_count: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  platform_fee: { type: Number, required: true },
  total_price: { type: Number, required: true },
  payment_method: { type: String, enum: ['TRANSFER', 'CASH'], required: true },
  payment_status: { type: String, enum: ['PENDING', 'PAID', 'REFUNDED'], default: 'PENDING' },
  status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING'], default: 'PENDING' },
  expires_at: { type: Date, required: true },
  cancel_reason: { type: String },
  cancelled_at: { type: Date },
  
  // Bảng booking_slots được nhúng vào đây
  booked_slots: [{
    time_slot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    slot_price: { type: Number, required: true }
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Booking', bookingSchema);
`,

  'Review.js': `const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cluster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueCluster', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Review', reviewSchema);
`,

  'Notification.js': `const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  payload: { type: Object },
  is_read: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Notification', notificationSchema);
`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
  console.log('Created:', filename);
}
