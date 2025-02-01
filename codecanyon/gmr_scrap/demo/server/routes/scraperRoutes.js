const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { startContainer } = require("../controllers/dockerController");

const environment = process.env.NODE_ENV || "development";
const machineBuildImageName =
  process.env.FIREBASE_PROJECT_ID || "gmr_scrap_machine";
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "fir-scrapp";

const handleContainerOperations = async (req, res) => {
  try {
    const { tag, type } = req.data;
    console.log("tag", tag);
    console.log("type", type);
    await startContainer({
      Image: machineBuildImageName,
      name: tag,
      Env: [
        `TAG=${tag}`,
        `NODE_ENV=${environment}`,
        `FIREBASE_PROJECT_ID=${firebaseProjectId}`,
        `FIREBASE_URL=${process.env.FIREBASE_IP}`,
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
