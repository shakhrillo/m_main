const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { imagesDocker, infoDocker } = require("../controllers/dockerController");
const router = express.Router();

router.post("/images", authMiddleware, async (req, res) => {
  try {
    await imagesDocker();
    res.status(200).send("Images updated");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/info", authMiddleware, async (req, res) => {
  try {
    await infoDocker();
    res.status(200).send("Info");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
