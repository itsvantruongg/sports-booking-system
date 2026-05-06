const mongoose = require('mongoose');

const venueClusterSchema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  address: { type: String },
  district: { type: String },
  city: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  description: { type: String },
  amenities: { type: [String], default: [] },
  // Ảnh nhúng trực tiếp
  images: [{
    url: { type: String },
    sort_order: { type: Number, default: 0 }
  }],
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'BANNED'], default: 'ACTIVE' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Index tìm kiếm nhanh theo thành phố
venueClusterSchema.index({ city: 1, district: 1, status: 1 });

module.exports = mongoose.model('VenueCluster', venueClusterSchema);
