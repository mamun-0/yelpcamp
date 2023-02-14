const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync');
const {
  validateCampground,
  validateReview,
} = require('./Middleware/middleware');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose
  .connect('mongodb://127.0.0.1:27017/yelpcamp')
  .then(() => {
    console.log('Database connected');
  })
  .catch(() => {
    console.log('Failed to connect.');
  });
// set EJS view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// routes
app.get(
  '/campgrounds',
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds });
  })
);

app.post(
  '/campgrounds/:id/review',
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const campground = await Campground.findById(id);
    const newReview = new Review({ ...review });
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
  })
);
app.get('/campgrounds/new', (req, res) => {
  res.render('campground/new');
});
app.post(
  '/campgrounds',
  validateCampground,
  wrapAsync(async (req, res, next) => {
    const { campground } = req.body;
    const newCampground = new Campground({ ...campground });
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
app.get(
  '/campgrounds/:id/edit',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
  })
);
app.put(
  '/campgrounds/:id',
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {
      ...campground,
    });
    res.redirect(`/campgrounds/${id}`);
  })
);
app.get(
  '/campgrounds/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campground/show', { campground });
  })
);
app.delete(
  '/campgrounds/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);
app.delete(
  '/campgrounds/:id/reviews/:reviewId',
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);
app.all('*', (req, res) => {
  res.send('404 page not found');
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong try again later!';
  res.status(statusCode).render('Error/error', { error: err });
});
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
