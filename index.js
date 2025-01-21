require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Hotel = require('./database');
const Booking = require('./models/booking');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Connection Error:', err.message));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find().limit(10).lean(); // Optimize query
    res.render('hotelList', { hotels });
  } catch (error) {
    console.error('Error fetching hotels:', error.message);
    res.status(500).send('Failed to load hotels');
  }
});
app.post('/book', async (req, res) => {
  try {
    const { hotelId, customerName, email, phone, checkInDate, checkOutDate, guests } = req.body;
    const booking = new Booking({ hotelId, customerName, email, phone, checkInDate, checkOutDate, guests });
    await booking.save();
    res.render('thankyou', { customerName, hotelId });
  } catch (error) {
    console.error('Booking Error:', error.message);
    res.status(500).send('Booking failed');
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
