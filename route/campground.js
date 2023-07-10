const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { storage } = require('../cloudinary/cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const {
  validateCampground,
  validateReview,
  isLoggedin,
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
  isLoggedin,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const authorID = req.user._id;
    const { review } = req.body;
    const campground = await Campground.findById(id);
    const newReview = new Review({ ...review });
    newReview.author = authorID;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Review created successfully.');
    res.redirect(`/campgrounds/${id}`);
  })
);
router.get('/new', isLoggedin, (req, res) => {
  res.render('campground/new');
});
router.post(
  '/',
  isLoggedin,
  upload.single('image'),
  validateCampground,
  wrapAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground({ ...campground });
    newCampground.author = req.user._id;
    newCampground.image = req.file.path;
    await newCampground.save();
    req.flash('success', 'Successfully created campground');
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
router.get(
  '/:id/edit',
  isLoggedin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
  })
);
router.put(
  '/:id',
  isLoggedin,
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
    const campground = await Campground.findById(id)
      .populate({ path: 'reviews', populate: { path: 'author' } })
      .populate('author');
    if (!campground) {
      req.flash('error', 'Campground not found!');
      return res.redirect('/campgrounds');
    }
    res.render('campground/show', { campground });
  })
);
router.delete(
  '/:id',
  isLoggedin,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
  })
);
router.delete(
  '/:id/reviews/:reviewId',
  isLoggedin,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
