const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Vui lòng nhập tên'] },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ'],
  },
  phone: { type: String },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['USER', 'OWNER', 'ADMIN'], default: 'USER' },
  tier: { type: String, enum: ['STANDARD', 'PRO', 'ELITE'], default: 'STANDARD' },
  status: { type: String, enum: ['ACTIVE', 'BANNED'], default: 'ACTIVE' },
  // must_change_password dành cho OWNER đăng nhập lần đầu
  must_change_password: { type: Boolean, default: false },
  // refresh_token lưu trực tiếp để có thể revoke
  refresh_token: { type: String, select: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VenueCluster' }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Tự động hash password trước khi lưu
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
