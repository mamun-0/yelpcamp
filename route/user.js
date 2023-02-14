const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const passport = require('passport');
router.get('/login', (req, res) => {
  res.render('user/login');
});
router.get('/register', (req, res) => {
  res.render('user/register');
});
router.post(
  '/register',
  wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    return res.redirect('/campgrounds');
  })
);
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/user/login',
    keepSessionInfo: true,
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome back!');
    res.redirect(redirectUrl);
  }
);
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye');
    res.redirect('/campgrounds');
  });
});
module.exports = router;
