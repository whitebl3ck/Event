const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  description: { type: String, required: true }, // ✅ added

  availability: {
    openDays: { type: [String], required: true }, 
    openHours: {
      start: { type: String, required: true }, 
      end: { type: String, required: true },   
    }
  },
  costAmount: { type: Number, required: true },
  costCurrency: { type: String, required: true },
  costType: { type: String, required: true },
  inHouseServices: {
    catering: { type: Boolean, default: false },
    bar: { type: Boolean, default: false },
    decoration: { type: Boolean, default: false },
    cleaning: { type: Boolean, default: false },
    others: { type: Boolean, default: false },
    othersDescription: { type: String, default: '' }
  },
  parkingAvailable: { type: Boolean, default: false },
  parkingSpaces: { type: Number, default: 0 },
  technicalSupport: {
    av: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    generator: { type: Boolean, default: false }
  },
  rules: { type: String },
  images: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Venue', VenueSchema);
