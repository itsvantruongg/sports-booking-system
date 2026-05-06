const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  slot_date: { type: Date, required: true },
  start_time: { type: String, required: true }, // "17:00"
  end_time: { type: String, required: true },   // "17:30"
  price: { type: Number, required: true },
  status: { type: String, enum: ['AVAILABLE', 'BOOKED', 'BLOCKED'], default: 'AVAILABLE' },
  blocked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  block_reason: { type: String },
});

// Index để tìm slot theo sân + ngày rất nhanh
timeSlotSchema.index({ court_id: 1, slot_date: 1, status: 1 });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
