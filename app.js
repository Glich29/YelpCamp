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

app.get('/campground/add', async (req, resp) => {
    const camp = new Campground({title: 'My Backyard', description: 'cheap camping!'});
    await camp.save();
    resp.send(camp);
});

app.listen(3000, () => {
    console.log('Serving on port: 3000');
});