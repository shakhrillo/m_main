const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { imagesDocker } = require("../controllers/dockerController");
const router = express.Router();

router.post("/images", authMiddleware, imagesDocker);

module.exports = router;
