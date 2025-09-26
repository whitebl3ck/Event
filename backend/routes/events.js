const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');

const router = express.Router();
const jwt = require('jsonwebtoken');

// Auth middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------- Multer Setup ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save to /uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // unique filename
  }
});

const upload = multer({ storage });

// ---------- Routes ----------

// Create a new event with images
router.post('/', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const data = req.body;

    // Parse JSON fields if sent as strings
    if (data.ticketPackages) {
      try {
        data.ticketPackages = JSON.parse(data.ticketPackages);
      } catch (e) {
        data.ticketPackages = [];
      }
    }

    // Collect file paths
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const event = new Event({
      name: data.name,
      type: data.type,
      date: data.date,
      time: data.time,
      duration: data.duration,
      location: data.location,
      description: data.description,
      programSchedule: data.programSchedule,
      entryRequirements: data.entryRequirements,
      ticketPackages: data.ticketPackages,
      audienceSize: data.audienceSize,
      specialGuests: data.specialGuests,
      catering: data.catering,
      parking: data.parking,
      accommodation: data.accommodation,
      refundPolicy: data.refundPolicy,
      images: imagePaths,
      owner: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Error saving event:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get events (optionally filtered by search query)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};
    if (q && typeof q === 'string' && q.trim() !== '') {
      const regex = new RegExp(q.trim(), 'i');
      query = {
        $or: [
          { name: regex },
          { location: regex },
          { description: regex }
        ]
      };
    }
    const events = await Event.find(query).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error('GET /api/events error:', err);
    res.status(500).json({ error: 'Failed to fetch events', details: err?.message });
  }
});

// Get events owned by current user
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const findQuery = { owner: req.user.id };
    if (q && typeof q === 'string' && q.trim() !== '') {
      const regex = new RegExp(q.trim(), 'i');
      Object.assign(findQuery, {
        $or: [
          { name: regex },
          { location: regex },
          { description: regex }
        ]
      });
    }
    const events = await Event.find(findQuery).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error('GET /api/events/mine error:', err);
    res.status(500).json({ error: 'Failed to fetch user events', details: err?.message });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('GET /api/events/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch event', details: err?.message });
  }
});

// Update an event by ID
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    // Find event by id and update with req.body or req.formData
    const event = await Event.findByIdAndUpdate(eventId, updates, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('PUT /api/events/:id error:', err);
    res.status(500).json({ error: 'Failed to update event', details: err?.message });
  }
});

module.exports = router;
