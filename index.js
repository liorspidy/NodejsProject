const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGODB_CREDENTIALS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Parse JSON bodies
app.use(express.json());

// Use the routes defined in routes.js
app.use('/', routes);

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
