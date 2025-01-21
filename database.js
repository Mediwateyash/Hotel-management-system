const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  hotel_name: {
    type: String,
  },
  price: {
    type: Number,
  },
  types: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
