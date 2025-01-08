const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  roles: [{ id: String, label: String }],
});


module.exports = mongoose.model('Events', eventSchema);
