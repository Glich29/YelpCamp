const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error in DB connection: "));
db.once("open", () => {
    console.log('MongoDB Connection Succeeded.');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, resp) => {
    resp.render('home');
});

app.get('/campgrounds', async (req, resp) => {
    const campgrounds =  await Campground.find({});
    resp.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, resp) => {
    resp.render('campgrounds/new');
});

app.post('/campgrounds/', async (req, resp) => {
    const campground = new Campground(req.body.campground); 
    await campground.save();
    resp.redirect(`/campground/${campground._id}`);  

});

app.get('/campground/:id', async (req, resp) => {
    const campground = await Campground.findById(req.params.id);
    resp.render('campgrounds/show', { campground });
});

app.get('/campground/:id/edit', async (req, resp) => {
    const campground = await Campground.findById(req.params.id);
    resp.render('campgrounds/edit', { campground });
})

app.put('/campground/:id', async (req, resp) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    resp.redirect(`/campground/${campground._id}`);
});

app.listen(3000, () => {
    console.log('Serving on port: 3000');
});