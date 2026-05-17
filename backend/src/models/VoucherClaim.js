const mongoose = require('mongoose');

const voucherClaimSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voucher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  claimed_at: { type: Date, default: Date.now }
});

// Một user chỉ được claim một mã voucher một lần (nhưng có thể dùng nhiều lần nếu voucher.usage_limit cho phép, 
// hoặc ta có thể giới hạn 1 user 1 lần dùng tùy business logic)
voucherClaimSchema.index({ user_id: 1, voucher_id: 1 }, { unique: true });

module.exports = mongoose.model('VoucherClaim', voucherClaimSchema);
