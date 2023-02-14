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
