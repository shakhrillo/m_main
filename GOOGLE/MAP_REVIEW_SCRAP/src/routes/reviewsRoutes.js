const express = require('express');
const router = express.Router();

const scrap = require('../controllers/scraperController');

router.post('/', async (req, res) => {
  const { 
    userId,
    reviewId,
    url
  } = req.body;

  scrap(url, userId, reviewId);

  res.json({
    success: true
  });
});

module.exports = router;