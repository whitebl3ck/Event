const express = require('express');
const multer = require('multer');
const path = require('path');
const Venue = require('../models/Venue');

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
// Update a venue by ID
router.put('/:id', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const data = req.body;

    // Parse JSON fields correctly if they come as strings
    if (data.availability) data.availability = JSON.parse(data.availability);
    if (data.inHouseServices) data.inHouseServices = JSON.parse(data.inHouseServices);
    if (data.technicalSupport) data.technicalSupport = JSON.parse(data.technicalSupport);

    // Collect file paths for new uploads
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Find the venue
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });

    // Only allow owner to update
    if (venue.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this venue.' });
    }

    // Merge images: keep existing unless replaced
    if (imagePaths.length > 0) {
      venue.images = imagePaths;
    } else if (data.images) {
      // If images are sent as string array, use them
      venue.images = Array.isArray(data.images) ? data.images : [data.images];
    }

    // Update other fields
    Object.keys(data).forEach(key => {
      if (key !== 'images') {
        venue[key] = data[key];
      }
    });

    await venue.save();
    res.json(venue);
  } catch (err) {
    console.error('Error updating venue:', err);
    res.status(400).json({ error: err.message });
  }
});

// Create a new venue with images
router.post('/', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const data = req.body;

    // Parse JSON fields correctly if they come as strings
    if (data.availability) data.availability = JSON.parse(data.availability);
    if (data.inHouseServices) data.inHouseServices = JSON.parse(data.inHouseServices);
    if (data.technicalSupport) data.technicalSupport = JSON.parse(data.technicalSupport);

    // Collect file paths
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const venue = new Venue({
      ...data,
      images: imagePaths,
      owner: req.user.id
    });
    
    await venue.save();

    res.status(201).json(venue);
  } catch (err) {
    console.error('Error saving venue:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get venues (optionally filtered by search query)
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
    const venues = await Venue.find(query).sort({ createdAt: -1 });
    res.json(venues);
  } catch (err) {
    console.error('GET /api/venues error:', err);
    res.status(500).json({ error: 'Failed to fetch venues', details: err?.message });
  }
});

// Get venues owned by current user
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
    const venues = await Venue.find(findQuery).sort({ createdAt: -1 });
    res.json(venues);
  } catch (err) {
    console.error('GET /api/venues/mine error:', err);
    res.status(500).json({ error: 'Failed to fetch user venues', details: err?.message });
  }
});

// Get a single venue by ID
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    console.error('GET /api/venues/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch venue', details: err?.message });
  }
});

module.exports = router;
