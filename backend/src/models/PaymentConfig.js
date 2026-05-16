const mongoose = require('mongoose');

const paymentConfigSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  vnpay: {
    tmn_code: { type: String, default: '' },
    hash_secret: { type: String, default: '' },
    is_active: { type: Boolean, default: false }
  },
  
  momo: {
    partner_code: { type: String, default: '' },
    access_key: { type: String, default: '' },
    secret_key: { type: String, default: '' },
    is_active: { type: Boolean, default: false }
  },
  
  payos: {
    client_id: { type: String, default: '' },
    api_key: { type: String, default: '' },
    checksum_key: { type: String, default: '' },
    is_active: { type: Boolean, default: false }
  },
  
  banking: {
    bank_name: { type: String, default: '' },
    account_number: { type: String, default: '' },
    account_name: { type: String, default: '' },
    is_active: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentConfig', paymentConfigSchema);
