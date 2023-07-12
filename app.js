const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

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

app.get('/', (req, resp) => {
    resp.render('home');
});

app.get('/campgrounds', async (req, resp) => {
    const campgrounds =  await Campground.find({});
    resp.render('campgrounds/index', { campgrounds });
});

app.get('/campground/:id', async (req, resp) => {
    const campground = await Campground.findById(req.params.id);
    resp.render('campgrounds/show', { campground });
});

app.listen(3000, () => {
    console.log('Serving on port: 3000');
});