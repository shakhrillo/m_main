const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const reviewsRoutes = require('./routes/reviewsRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const { verifyIdToken } = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: 'GET,POST',
  credentials: true,
  optionsSuccessStatus: 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(verifyIdToken);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.use('/api/reviews', reviewsRoutes);
app.use('/api/stripe', stripeRoutes);
app.get('/', (req, res) => res.send('Server is running'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
