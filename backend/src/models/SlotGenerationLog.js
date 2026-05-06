const mongoose = require('mongoose');

const slotGenerationLogSchema = new mongoose.Schema({
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  generated_up_to: { type: Date, required: true },
  run_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SlotGenerationLog', slotGenerationLogSchema);
