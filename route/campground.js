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
    req.flash('success', 'Review created successfully.');
    res.redirect(`/campgrounds/${id}`);
  })
);
router.get('/new', (req, res) => {
  res.render('campground/new');
});
router.post(
  '/',
  validateCampground,
  wrapAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground({ ...campground });
    await newCampground.save();
    req.flash('success', 'Successfully created campground');
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
    await Campground.findByIdAndUpdate(id, {
      ...campground,
    });
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
  })
);
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
      req.flash('error', 'Campground not found!');
      return res.redirect('/campgrounds');
    }
    res.render('campground/show', { campground });
  })
);
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
  })
);
router.delete(
  '/:id/reviews/:reviewId',
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
