const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createMachine } = require("../services/firebaseService");
const { startContainer } = require("../controllers/dockerController");
const { startVmInstance } = require("../controllers/googleController");

const environment = process.env.NODE_ENV || "development";
const machineBuildImageName =
  process.env.MACHINE_BUILD_IMAGE_NAME || "gmr_scrap_selenium";
const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "fir-scrapp";

const handleContainerOperations = async (req, res, isInfo = false) => {
  try {
    const { userId, reviewId } = req.data;
    const prefix = isInfo ? overviewPrefix : reviewsPrefix;
    const buildTag = `${prefix}_${userId}_${reviewId}`.toLowerCase();

    await createMachine(buildTag, {
      ...req.data,
      createdAt: +new Date(),
    });

    if (environment === "production") {
      await startVmInstance({
        tag: buildTag,
        startupScript: `
          # Run the tests
          cd /home/st/m_main/codecanyon/gmr_scrap/demo

          docker run \
            --name ${config.tag} \
            -e TAG=${config.tag} \
            -e NODE_ENV=${environment} \
            -e FIREBASE_PROJECT_ID=${firebaseProjectId} \
            -e STORAGE_BUCKET=gs://${firebaseProjectId}.firebasestorage.app \
            gmr_scrap_selenium \
            ${config.command}
        `,
        command: isInfo ? "npm run info" : "npm run start",
      });
    }

    if (environment === "development") {
      await startContainer({
        Image: machineBuildImageName,
        name: buildTag,
        Env: [
          `TAG=${buildTag}`,
          `NODE_ENV=${environment}`,
          `FIREBASE_PROJECT_ID=${firebaseProjectId}`,
          `STORAGE_BUCKET=gs://${firebaseProjectId}.firebasestorage.app`,
        ],
        Cmd: isInfo ? ["npm", "run", "info"] : ["npm", "run", "start"],
      });
    }

    res.json({ message: "Started" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.post("/", authMiddleware, async (req, res) =>
  handleContainerOperations(req, res)
);

router.post("/info", authMiddleware, async (req, res) =>
  handleContainerOperations(req, res, true)
);

module.exports = router;
