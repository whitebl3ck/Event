const mongoose = require('mongoose');

const EventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  ticketType: {
    type: String,
    required: true
  },
  ticketQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  // NEW: Payment method tracking
  paymentMethod: {
    type: String,
    enum: ['paystack', 'stripe', 'manual', 'bank_transfer'],
    default: 'paystack'
  },
  // NEW: Universal payment reference
  paymentReference: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  // NEW: Paystack-specific data
  paystackData: {
    reference: String,
    access_code: String,
    authorization_url: String,
    gateway_response: String,
    paid_at: Date,
    channel: String, // card, bank, ussd, qr, mobile_money, bank_transfer
    fees: Number,
    authorization: {
      authorization_code: String,
      card_type: String,
      last4: String,
      exp_month: String,
      exp_year: String,
      bin: String,
      bank: String,
      channel: String,
      signature: String,
      reusable: Boolean,
      country_code: String
    }
  },
  // NEW: Stripe-specific data (for dual support)
  stripeData: {
    session_id: String,
    payment_intent_id: String,
    charge_id: String
  },
  // NEW: Additional metadata
  metadata: {
    user_agent: String,
    ip_address: String,
    referrer: String,
    device_type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on every save
EventRegistrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
EventRegistrationSchema.index({ paymentReference: 1 });
EventRegistrationSchema.index({ event: 1, paymentStatus: 1 });
EventRegistrationSchema.index({ customerEmail: 1 });

module.exports = mongoose.model('EventRegistration', EventRegistrationSchema);