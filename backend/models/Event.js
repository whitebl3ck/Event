const mongoose = require('mongoose');


const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['social gathering', 'corporate', 'wedding', 'cultural', 'sport', 'virtual']
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  programSchedule: { type: String },
  entryRequirements: { type: String }, // tickets, invitations, age, dress code
  ticketPackages: [{
    label: String, // e.g. Early Bird, VIP, Group
    price: Number,
    currency: { type: String, default: 'USD' },
    description: String
  }],
  audienceSize: { type: Number },
  services: {
    specialGuests: { type: String, required: false },
    catering: { type: String, required: false },
    parking: { type: String, required: false },
    accommodation: { type: String, required: false },
    others: { type: Boolean, default: false },
    othersDescription: { type: String, default: '' }
  },
  refundPolicy: { type: String, required: false },
  images: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
