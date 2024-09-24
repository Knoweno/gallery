// models/Photo.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  name: String,
  url: String
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
