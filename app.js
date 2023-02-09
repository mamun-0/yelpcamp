const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// routes
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campground/index', { campgrounds });
});
app.get('/campgrounds/new', (req, res) => {
  res.render('campground/new');
});
app.post('/campground', async (req, res) => {
  const { campground } = req.body;
  const newCampground = new Campground({ ...campground });
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});
app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campground/edit', { campground });
});
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const { campground } = req.body;
  const updatedCampground = await Campground.findByIdAndUpdate(id, {
    ...campground,
  });
  res.redirect(`/campgrounds/${id}`);
});
app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campground/show', { campground });
});
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

app.all('*', (req, res) => {
  res.send('404 page not found');
});
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
