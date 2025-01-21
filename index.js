const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import models
const Hotel = require('./database.js');
const Booking = require('./models/booking.js'); // Correct path to your booking model

const app = express();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views directory

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for booking a hotel
app.post('/book', async (req, res) => {
  console.log(req.body); // Log the request body to debug
  try {
    const { hotelId, customerName, email, phone, checkInDate, checkOutDate, guests } = req.body;

    const newBooking = new Booking({
      hotelId,
      customerName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      guests,
    });

    await newBooking.save();
    res.render('thankyou', { customerName, hotelId });
  } catch (error) {
    console.error('Error during booking:', error);
    res.status(500).send(`Booking failed. Error: ${error.message}`);
  }
});

// Route for the home page
app.get('/', (req, res) => {
  res.render('home'); // Render the home.ejs template
});
app.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find().limit(50).lean(); // Limit results and use lean() for faster reads
    res.render('hotelList', { hotels });
  } catch (error) {
    console.error('Error fetching hotels:', error.message);
    res.status(500).send('Failed to load hotels');
  }
});

app.use('/favicon.ico', (req, res) => res.sendStatus(204));

// Route for adding a new hotel
app.post('/add-hotel', async (req, res) => {
  const { hotel_name, price, types, description, image } = req.body;

  try {
    // Create a new hotel document using the existing schema
    const newHotel = new Hotel({
      hotel_name,
      price,
      types,
      description,
      image,
    });

    // Save the new hotel to the database
    await newHotel.save();

  } catch (error) {
    // Handle any errors
    console.error('Error adding hotel:', error);
    res.status(500).json({
      message: 'Failed to add hotel.',
      error: error.message,
    });
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server is up and running at port 3000.');
});
