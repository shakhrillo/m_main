const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const scrap = require('../controllers/scraperController');

router.post('/', authenticateToken, async (req, res) => {
  scrap(req.data);
  res.json(req.data);
});

module.exports = router;