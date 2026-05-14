const mongoose = require('mongoose');

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
  payment_method: { type: String, enum: ['TRANSFER', 'CASH', 'VNPAY', 'MOMO', 'BANKING'], required: true },
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
