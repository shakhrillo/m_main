require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  dockerInfo,
  analyzeSystem,
} = require("../controllers/dockerController");

router.get("/", authMiddleware, async (req, res) => {
  const info = await dockerInfo();

  res.json({ info });
});

router.get("/usage", authMiddleware, async (req, res) => {
  const usage = await analyzeSystem();

  res.json({ usage });
});

module.exports = router;
