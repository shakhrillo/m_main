const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const reviewsRoutes = require('./routes/reviewsRoutes');
const { verifyIdToken } = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS to allow only http://localhost:4200
const corsOptions = {
  origin: 'http://localhost:4200', // Allow only localhost:4200
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials
  optionsSuccessStatus: 204 // For legacy browser support
};

// Enable CORS with specified options
app.use(cors(corsOptions));
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
