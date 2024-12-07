require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/clear-cache", authMiddleware, async (req, res) => {
  res.json({ message: "Cache cleared" });
});

router.delete("/", authMiddleware, async (req, res) => {
  res.json({ message: "Image removed" });
});

module.exports = router;
