const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createMachine } = require("../services/firebaseService");
const { startContainer } = require("../controllers/dockerController");

const machineBuildImageName = process.env.MACHINE_BUILD_IMAGE_NAME;
const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";

const handleContainerOperations = async (req, res, isInfo = false) => {
  try {
    const { userId, reviewId } = req.data;
    const prefix = isInfo ? overviewPrefix : reviewsPrefix;
    const buildTag = `${prefix}_${userId}_${reviewId}`.toLowerCase();

    await createMachine(buildTag, {
      ...req.data,
      createdAt: +new Date(),
    });

    await startContainer({
      Image: machineBuildImageName,
      name: buildTag,
      Env: [
        `TAG=${buildTag}`,
        `NODE_ENV=${process.env.NODE_ENV}`,
        `FIREBASE_PROJECT_ID=${process.env.FIREBASE_PROJECT_ID}`,
      ],
      Cmd: isInfo ? ["npm", "run", "info"] : ["npm", "run", "start"],
    });

    res.json({ message: "Started" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.post("/", authMiddleware, (req, res) =>
  handleContainerOperations(req, res)
);
router.post("/info", authMiddleware, (req, res) =>
  handleContainerOperations(req, res, true)
);

module.exports = router;
