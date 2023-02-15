const { campgroundSchema, reviewSchema } = require('../JoiSchema/joiSchema');
const ExpressError = require('../utils/ExpressError');

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(',');
    return next(new ExpressError(msg, 400));
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(',');
    return next(new ExpressError(msg, 400));
  }
  next();
};
module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must login first.');
    return res.redirect('/user/login');
  } else {
    next();
  }
};
