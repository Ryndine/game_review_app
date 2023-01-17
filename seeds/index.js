const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.set('strictQuery', false); // deprecation warning 
mongoose.connect('mongodb://localhost:27017/campground-app', {
    // useNewUrlParser: true, (no longer supported, always true)
    // useCreateIndex: true, (no longer supported, always true)
    // useUnifiedTopology: true (no longer supported, always true)
});

const db = mongoose.connection;
// logic to check for error
db.on('error', console.error.bind(console, 'connection error:'));
// so we know the connection went through
db.once('open', () => {
    console.log('Database connected');
});

//pick random element from array
const sample = array => array[Math.floor(Math.random() * array.length)];

// seeding database
const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})