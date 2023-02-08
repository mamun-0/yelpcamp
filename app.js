const express = require('express');
const app = express();
const path = require('path');
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//middleware
app.set(express.urlencoded({ extended: true }));

app.all('*', (req, res) => {
  res.send('404 page not found');
});
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
