var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/scraper');
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var travelData = new mongoose.Schema({
  headline: String,
  author: String,
  summary: String,
  image: String,
  link: String
});

module.exports = mongoose.model('Listings', travelData);