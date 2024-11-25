require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { dockerInfo } = require("../controllers/dockerController");

router.get("/", authMiddleware, async (req, res) => {
  const info = await dockerInfo();

  res.json({ info });
});

module.exports = router;
