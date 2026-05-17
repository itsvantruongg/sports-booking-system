const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true, uppercase: true },
  discount_type: { type: String, enum: ['PERCENT', 'FIXED'], required: true },
  discount_value: { type: Number, required: true },
  min_booking_amount: { type: Number, default: 0 },
  max_discount_amount: { type: Number }, // Cho trường hợp PERCENT
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  usage_limit: { type: Number, default: 100 },
  used_count: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  
  // Tùy chọn giới hạn cho sân cụ thể hoặc cụm sân cụ thể
  target_cluster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueCluster' },
  target_court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Index để tìm nhanh code và kiểm tra hiệu lực
voucherSchema.index({ code: 1, is_active: 1 });

module.exports = mongoose.model('Voucher', voucherSchema);
