const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const {
  validateCampground,
  validateReview,
} = require('../Middleware/middleware');
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds });
  })
);

router.post(
  '/:id/review',
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
router.get('/new', (req, res) => {
  res.render('campground/new');
});
router.post(
  '/',
  validateCampground,
  wrapAsync(async (req, res, next) => {
    const { campground } = req.body;
    const newCampground = new Campground({ ...campground });
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
  })
);
router.put(
  '/:id',
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
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campground/show', { campground });
  })
);
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);
router.delete(
  '/:id/reviews/:reviewId',
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
