// routes/reviews.js

const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/', reviewController.getReviews);

module.exports = router;
