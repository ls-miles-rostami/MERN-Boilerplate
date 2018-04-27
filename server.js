const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users');

mongoose
  .connect('mongodb://localhost/mern')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())




app.use('/api/users', users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
