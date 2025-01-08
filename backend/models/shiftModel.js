// shiftModel.js
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  event: { type: String, required: true },
  role: { type: String, required: true },
  timeSlots: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      status: { type: String, default: 'available' },
      conflict: { type: Boolean, default: false }
    }
  ]
});
module.exports = mongoose.model('Shift', shiftSchema);