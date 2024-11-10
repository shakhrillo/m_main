const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const scrap = require("../controllers/scraperController");
const scrapInfo = require("../controllers/scraperInfoController");

router.post("/", authenticateToken, async (req, res) => {
  scrap(req.data);
  res.json(req.data);
});

router.post("/info", authenticateToken, async (req, res) => {
  scrapInfo(req.data);
  res.json(req.data);
});

module.exports = router;
