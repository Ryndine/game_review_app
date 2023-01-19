const mongoose = require('mongoose');
const companies = require('./mockData')
const {tags, descriptors} = require('./seedHelpers')
const GameReviews = require('../models/gamereview')

mongoose.set('strictQuery', false); // deprecation warning 
mongoose.connect('mongodb://localhost:27017/gamereview-app', {
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
    await GameReviews.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20 + 10)
        const game = new GameReviews({
            company: `${companies[random1000].company}, ${companies[random1000].title}`,
            title: `${sample(descriptors)} ${sample(tags)}`,
            image: 'https://source.unsplash.com/collection/4959235',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus consequuntur dolorum impedit! Molestiae ratione iusto autem nisi et illum eligendi fugiat delectus rerum, aperiam hic voluptatibus harum laboriosam minima placeat?',
            price
        })
        await game.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})