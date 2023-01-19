const mongoose = require('mongoose');
// tighten up code, going to be referencing Schema more
const Schema = mongoose.Schema;

// temporary, will expand later
const GameReviewSchema = new Schema({
    company: String,
    location: String,
    title: String,
    image: String,
    price: Number,
    description: String
});

// compile mongoose model
module.exports = mongoose.model('Gamereviews', GameReviewSchema);