const express = require('express');
const { createReview } = require('../controllers/reviewController');
const router = express.Router();
const main = require('../controllers/scraperController');

// POST google map reviews
router.post('/', async (req, res) => {
  const user = req.user;
  const uid = user?.uid;
  const { url } = req.body;
  const review = await createReview(uid, { url });

  main(url, uid, review.id, process.env.NODE_ENV === 'development');

  res.json({
    success: true
  });
});

module.exports = router;