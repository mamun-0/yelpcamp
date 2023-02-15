const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const campgroundRoute = require('./route/campground');
const userRoute = require('./route/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');
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
app.use(
  session({
    secret: 'iwillsetthissecretkeyletter',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.message = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
// routes
app.use('/campgrounds', campgroundRoute);
app.use('/user', userRoute);
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
