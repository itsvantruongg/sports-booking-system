const mongoose = require('mongoose');

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
