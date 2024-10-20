// app.js

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { admin } = require('./config/firebase'); // Import Firebase config

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Firebase Middleware Example: Authenticate requests with Firebase
app.use((req, res, next) => {
  console.log('req.headers:', req.headers);
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.user = decodedToken;
        next();
      })
      .catch(() => res.status(401).json({ message: 'Unauthorized' }));
  } else {
    next();
  }
});

// User routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
