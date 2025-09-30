const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const venuesRouter = require('./routes/venues');
app.use('/api/venues', venuesRouter);


const eventsRouter = require('./routes/events');
app.use('/api/events', eventsRouter);

const eventRegistrationsRouter = require('./routes/eventRegistrations');
app.use('/api/event-registrations', eventRegistrationsRouter);

const stripeRouter = require('./routes/stripe');
app.use('/api/stripe', stripeRouter);

// Example route
app.get('/', (req, res) => res.send('API Running'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//Make /uploads folder public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const paystackRouter = require('./routes/paystack');
app.use('/api/paystack', paystackRouter);