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
  const data = scrapInfo(req.data);
  console.log("Data:", data);
  res.json(data);
});

module.exports = router;
