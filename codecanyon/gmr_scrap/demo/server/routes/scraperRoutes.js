const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { startContainer } = require("../controllers/dockerController");

const handleContainerOperations = async (req, res) => {
  try {
    const { tag, type } = req.data;
    console.log("tag", tag);
    console.log("type", type);

    if (!tag || !type) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await startContainer({
      Image: process.env.MACHINE_BUILD_IMAGE_NAME,
      name: tag,
      Env: [
        `TAG=${tag}`,
        `APP_ENVIRONMENT=${process.env.APP_ENVIRONMENT}`,
        `APP_FIREBASE_PROJECT_ID=${process.env.APP_FIREBASE_PROJECT_ID}`,
        `APP_FIREBASE_EMULATOR_FIRESTORE=${process.env.APP_FIREBASE_EMULATOR_FIRESTORE}`,
        `APP_FIREBASE_IPV4_ADDRESS=${process.env.IN_DOCKER ? process.env.APP_FIREBASE_IPV4_ADDRESS : 'host.docker.internal'}`,
        `APP_FIREBASE_EMULATOR_STORAGE=${process.env.APP_FIREBASE_EMULATOR_STORAGE}`,
        `CHROME_PATH=/usr/bin/chromium-browser`,
      ],
      Cmd: ["npm", "run", type],
      HostConfig: {
        AutoRemove: !true,
      },
    });

    res.json({ message: "Started" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.post("/", authMiddleware, async (req, res) =>
  handleContainerOperations(req, res)
);

module.exports = router;
