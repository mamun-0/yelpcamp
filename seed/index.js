const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelper');
const cities = require('./cities');

mongoose
  .connect('mongodb://localhost:27017/yelpcamp')
  .then(() => {
    console.log('Database connected');
  })
  .catch(() => {
    console.log('Failed to connect database. Try again later');
  });

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let x = 0; x < 50; x++) {
    const randomCity = random(cities);
    const price = Math.floor(Math.random() * 20) + 5;
    const camp = new Campground({
      title: `${random(descriptors)} ${random(places)}`,
      location: `${randomCity['city']} ${randomCity['state']}`,
      image: 'http://source.unsplash.com/collection/484351',
      price,
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus consequatur minima repellendus eos consectetur vel ipsum minus praesentium debitis similique animi, tempore eligendi sint, maiores placeat quod cupiditate enim dolores!',
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
