const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')

mongoose.set('strictQuery', false);
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


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')
)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({title: 'My backyeard', description: 'Very small.'});
    await camp.save();
    res.send(camp)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})