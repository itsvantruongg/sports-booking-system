const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  cluster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueCluster', required: true },
  sport_type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SportType', required: true },
  name: { type: String, required: true },
  description: { type: String },
  image_url: { type: String },
  status: { type: String, enum: ['ACTIVE', 'BLOCKED', 'MAINTENANCE'], default: 'ACTIVE' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Court', courtSchema);
