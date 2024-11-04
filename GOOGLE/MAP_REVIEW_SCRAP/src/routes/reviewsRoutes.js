const express = require('express');
const router = express.Router();

const scrap = require('../controllers/scraperController');

router.post('/', async (req, res) => {
  const { 
    userId,
    reviewId,
    url
  } = req.body;

  scrap(url, userId, reviewId, limit = 50);

  res.json({
    success: true
  });
});

module.exports = router;