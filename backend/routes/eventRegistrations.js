const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');

// Register for an event
router.post('/', async (req, res) => {
  try {
    const { 
      event, 
      customerName, 
      customerEmail, 
      customerPhone, 
      ticketType, 
      ticketQuantity, 
      totalAmount,
      paymentMethod = 'paystack', // NEW: Default to Paystack
      metadata = {} // NEW: Additional metadata
    } = req.body;

    // Validate event exists
    const eventObj = await Event.findById(event);
    if (!eventObj) return res.status(404).json({ error: 'Event not found' });

    // Validate ticket type exists in event
    const ticketPackage = eventObj.ticketPackages?.find(pkg => pkg.label === ticketType);
    if (!ticketPackage) {
      return res.status(400).json({ error: 'Invalid ticket type' });
    }

    // Validate total amount matches ticket price * quantity
    const expectedAmount = ticketPackage.price * ticketQuantity;
    if (Math.abs(totalAmount - expectedAmount) > 0.01) { // Allow for small floating point differences
      return res.status(400).json({ 
        error: 'Total amount does not match ticket price',
        expected: expectedAmount,
        received: totalAmount
      });
    }

    const registration = new EventRegistration({
      event,
      customerName,
      customerEmail,
      customerPhone,
      ticketType,
      ticketQuantity,
      totalAmount,
      paymentMethod, // NEW: Track payment method
      paymentStatus: totalAmount > 0 ? 'pending' : 'paid', // Free events are automatically paid
      metadata: {
        ...metadata,
        user_agent: req.headers['user-agent'],
        ip_address: req.ip || req.connection.remoteAddress,
        referrer: req.headers.referer
      }
    });

    await registration.save();

    // Populate event data for response
    await registration.populate('event');

    res.status(201).json({
      success: true,
      message: 'Registration created successfully',
      data: registration
    });

  } catch (err) {
    console.error('Registration creation error:', err);
    
    // Handle duplicate registration attempts
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate registration detected',
        message: 'You have already registered for this event with this email'
      });
    }

    res.status(400).json({ 
      error: 'Registration failed',
      message: err.message 
    });
  }
});

// Get a specific registration
router.get('/:id', async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id).populate('event');
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List registrations for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { status, paymentMethod } = req.query;
    
    let query = { event: req.params.eventId };
    
    // Filter by payment status if provided
    if (status && ['pending', 'paid', 'failed', 'cancelled', 'refunded'].includes(status)) {
      query.paymentStatus = status;
    }
    
    // Filter by payment method if provided
    if (paymentMethod && ['paystack', 'stripe', 'manual', 'bank_transfer'].includes(paymentMethod)) {
      query.paymentMethod = paymentMethod;
    }
    
    const registrations = await EventRegistration.find(query)
      .populate('event', 'name date location')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update registration payment status (for manual updates)
router.patch('/:id/payment-status', async (req, res) => {
  try {
    const { paymentStatus, paymentReference, notes } = req.body;
    
    if (!['pending', 'paid', 'failed', 'cancelled', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }
    
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    
    registration.paymentStatus = paymentStatus;
    if (paymentReference) registration.paymentReference = paymentReference;
    if (notes) registration.metadata.adminNotes = notes;
    
    await registration.save();
    
    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: registration
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a registration
router.delete('/:id', async (req, res) => {
  try {
    const registration = await EventRegistration.findByIdAndDelete(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.json({ message: 'Registration deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;