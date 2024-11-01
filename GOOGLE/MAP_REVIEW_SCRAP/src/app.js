const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const reviewsRoutes = require('./routes/reviewsRoutes');
const { verifyIdToken } = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true, // Allow credentials
  optionsSuccessStatus: 204 // Some legacy browsers choke on 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(verifyIdToken);

// Routes
app.use('/api/reviews', reviewsRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Firebase Admin API with Express!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
