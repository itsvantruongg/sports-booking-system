const mongoose = require('mongoose');

const zaloConfigSchema = new mongoose.Schema({
  oa_id: {
    type: String,
    required: true,
    unique: true
  },
  access_token: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ZaloConfig', zaloConfigSchema);
