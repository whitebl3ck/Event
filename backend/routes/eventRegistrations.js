const express = require('express');
const router = express.Router();
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');

// Register for an event
router.post('/', async (req, res) => {
  try {
  const { event, customerName, customerEmail, customerPhone, ticketType, ticketQuantity, totalAmount } = req.body;
    // Validate event exists
    const eventObj = await Event.findById(event);
    if (!eventObj) return res.status(404).json({ error: 'Event not found' });

    const registration = new EventRegistration({
      event,
      customerName,
      customerEmail,
      customerPhone,
      ticketType,
      ticketQuantity,
      totalAmount,
      paymentStatus: 'pending'
    });
    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    const registrations = await EventRegistration.find({ event: req.params.eventId });
    res.json(registrations);
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
