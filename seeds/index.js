const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const fetch = require("node-fetch");

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const requestUrl =
      'https://api.unsplash.com/collections/483251/photos?client_id=KEiwdjQuYKYdIXLvXDEbQ5L1g6ZMLgO04cRGEOnjxiU';


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomImage = await getNewImage();
        console.log(randomImage);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: randomImage,
            price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, accusantium! Vel animi quos eum numquam corrupti quo ipsum incidunt? Incidunt rerum id explicabo eligendi dolores. Recusandae deleniti dolore id reiciendis!'
        })
        await camp.save();
    }
}

async function getNewImage() {
    let randomNumber = Math.floor(Math.random() * 10);
    return fetch(requestUrl)
      .then((response) => response.json())
      .then((data) => {
        let allImages = data[randomNumber];
        return allImages.urls.regular;
    });
}

seedDB().then(() => {
    mongoose.connection.close();
});