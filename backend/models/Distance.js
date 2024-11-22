const mongoose = require('mongoose');

const DistanceSchema = new mongoose.Schema({
  cep: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: Number, required: true },
  current_location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  }, 
  calculated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Distance', DistanceSchema);
