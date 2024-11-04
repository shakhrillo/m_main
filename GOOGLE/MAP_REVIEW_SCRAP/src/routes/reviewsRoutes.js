const express = require('express');
const router = express.Router();

const scrap = require('../controllers/scraperController');

router.post('/', async (req, res) => {
  const user = req.user;
  const uid = user.uid;
  const { reviewId, url, limit } = req.body;

  scrap(url, uid, reviewId, limit = 50);

  res.json({
    success: true
  });
});

module.exports = router;