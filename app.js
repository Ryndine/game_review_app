const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const GameReviews = require('./models/gamereview');

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

const app = express();

app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'))
// parse the "body"
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.render('home')
});

// list of all the gamereviews
app.get('/gamereviews', async(req, res) => {
    const gamereviews = await GameReviews.find({});
    res.render('gamereviews/index', { gamereviews });
});

// create new game
app.get('/gamereviews/new', (req, res) => {
    res.render('gamereviews/new');
})

app.post('/gamereviews', async(req, res) => {
    const game = new GameReviews(req.body.game);
    await game.save();
    res.redirect(`/gamereviews/${game._id}`);
})

// view a single game
app.get('/gamereviews/:id', async(req, res) => {
    const game = await GameReviews.findById(req.params.id);
    res.render('gamereviews/show', { game });
});

// edit game
app.get('/gamereviews/:id/edit', async(req, res) => {
    const game = await GameReviews.findById(req.params.id);
    res.render('gamereviews/edit', { game });
})

app.put('/gamereviews/:id', async(req, res) => {
    const { id } = req.params;
    const game = await GameReviews.findByIdAndUpdate(id, { ...req.body.game });
    res.redirect(`/gamereviews/${game._id}`)
});

app.delete('/gamereviews/:id', async(req, res) => {
    const { id } = req.params;
    await GameReviews.findByIdAndDelete(id);
    res.redirect('/gamereviews')
})




app.listen(3000, () => {
    console.log('Serving on port 3000');
});