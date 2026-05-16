const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Họ tên là bắt buộc']
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc']
  },
  fieldName: {
    type: String,
    required: [true, 'Tên sân là bắt buộc']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc']
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONTACTED', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Partnership', partnershipSchema);
