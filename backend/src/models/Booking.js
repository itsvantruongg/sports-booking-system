const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  booking_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  slot_count: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  platform_fee: { type: Number, required: true }, // Đây là phí sàn (commission)
  discount_amount: { type: Number, default: 0 },
  voucher_code: { type: String },
  total_price: { type: Number, required: true }, // Số tiền User thực trả
  commission_status: { type: String, enum: ['UNPAID', 'PAID'], default: 'UNPAID' },
  payment_method: { type: String, enum: ['TRANSFER', 'CASH', 'VNPAY', 'MOMO', 'BANKING', 'PAYOS'], required: true },
  payment_status: { type: String, enum: ['PENDING', 'PAID', 'REFUNDED'], default: 'PENDING' },
  status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING'], default: 'PENDING' },
  expires_at: { type: Date }, // Không bắt buộc vì sẽ xóa khi chọn thanh toán
  cancel_reason: { type: String },
  cancelled_at: { type: Date },
  
  // Bảng booking_slots được nhúng vào đây
  booked_slots: [{
    time_slot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
    slot_price: { type: Number, required: true }
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Booking', bookingSchema);
