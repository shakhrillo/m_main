const express = require('express');
const router = express.Router();

const { createReview } = require('../controllers/reviewController');
const scrap = require('../controllers/scraperController');

router.post('/', async (req, res) => {
  const user = req.user;
  const uid = user?.uid;
  const { url } = req.body;
  const review = await createReview(uid, { url });

  scrap(url, uid, review.id);

  res.json({
    success: true
  });
});

module.exports = router;