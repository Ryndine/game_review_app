const mongoose = require('mongoose');
// tighten up code, going to be referencing Schema more
const Schema = mongoose.Schema;

// temporary, will expand later
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

// compile mongoose model
module.exports = mongoose.model('Campground', CampgroundSchema);