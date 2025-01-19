const express = require('express');
const path = require('path'); // Import the 'path' module
const mongoose = require('mongoose');
const Hotel = require('./database.js');
const Booking = require('./models/booking.js');  // Correct path to your booking model
const app = express();

mongoose.connect("mongodb://localhost:27017/hotel");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Now this will work
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.post('/book', async (req, res) => {
  console.log(req.body); // Log the request body to check for missing fields
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

// Route for home page
app.get('/', (req, res) => {
  res.render('home'); // Render the home.ejs template
});

app.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find(); // Fetch all hotels from the database
    res.render('hotelList', { hotels }); // Pass data to the EJS template
  } catch (e) {
    console.log("Could not retrieve hotels:", e);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is up and running at port 3000.");
});
