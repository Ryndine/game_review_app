const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const { gameSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const GameReviews = require('./models/gamereview');


mongoose.set('strictQuery', false); // deprecation warning 
mongoose.connect('mongodb://localhost:27017/gamereview-app', {
    // useNewUrlParser: true, (no longer supported, always true)
    // useCreateIndex: true, (no longer supported, always true)
    // useUnifiedTopology: true (no longer supported, always true)
});

// console.log(process.env.TEST_SECRET)

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
// parse the "body"979 8861 2634	

app.use(express.urlencoded({extended: true}));

const validateGame = (req, res, next) => {

    const { error }= gameSchema.validate(req.body);
    if(error){
        // error.details return  array, need to map over and join
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

app.get('/', (req, res) => {
    res.render('home')
});

// list of all the gamereviews
app.get('/gamereviews', validateGame, catchAsync(async(req, res) => {
    const gamereviews = await GameReviews.find({});
    res.render('gamereviews/index', { gamereviews });
}));

// create new game
app.get('/gamereviews/new', (req, res) => {
    res.render('gamereviews/new');
});

app.post('/gamereviews', catchAsync(async(req, res, next) => {
    // if(!req.body.game) throw new ExpressError('Invalid Game Data', 400)
    const game = new GameReviews(req.body.game);
    await game.save();
    res.redirect(`/gamereviews/${game._id}`);
}));

// view a single game
app.get('/gamereviews/:id', catchAsync(async(req, res) => {
    const game = await GameReviews.findById(req.params.id);
    res.render('gamereviews/show', { game });
}));

// edit game
app.get('/gamereviews/:id/edit', validateGame, catchAsync(async(req, res) => {
    const game = await GameReviews.findById(req.params.id);
    res.render('gamereviews/edit', { game });
}));

app.put('/gamereviews/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const game = await GameReviews.findByIdAndUpdate(id, { ...req.body.game });
    res.redirect(`/gamereviews/${game._id}`)
}));

app.delete('/gamereviews/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await GameReviews.findByIdAndDelete(id);
    res.redirect('/gamereviews')
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Something went wrong"} = err;
    if(!err.message) err.message = 'Oh no, something is wrong.'
    res.status(statusCode).render('error', { err });
});



app.listen(3000, () => {
    console.log('Serving on port 3000');
});