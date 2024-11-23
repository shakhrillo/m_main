require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { removeImage } = require("../controllers/dockerController");

router.delete("/", authMiddleware, async (req, res) => {
  const { buildTag } = req.data;
  await removeImage(buildTag);
  res.json({ message: "Image removed" });
});

module.exports = router;
