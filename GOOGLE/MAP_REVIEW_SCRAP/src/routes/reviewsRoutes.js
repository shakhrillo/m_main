const express = require('express');
const router = express.Router();

const { createReview } = require('../controllers/reviewController');
const scrap = require('../controllers/scraperController');

router.post('/', async (req, res) => {
  // const user = req.user;
  // const uid = user?.uid;
  const { 
    userId,
    reviewId,
    url
  } = req.body;
  // const review = await createReview(uid, { url });

  scrap(url, userId, reviewId);

  res.json({
    success: true
  });
});

module.exports = router;