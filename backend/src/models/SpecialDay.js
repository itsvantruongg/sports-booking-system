const mongoose = require('mongoose');

const specialDaySchema = new mongoose.Schema({
  calendar_date: { type: Date, required: true },
  name: { type: String, required: true },
  day_type: { type: String, enum: ['HOLIDAY'], required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('SpecialDay', specialDaySchema);
