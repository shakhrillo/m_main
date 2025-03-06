const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createAndStartContainer } = require("../controllers/dockerController");

/**
 * Handle docker container operations.
 * Type of operations:
 * - Start information scraping
 * - Start extracting comments & media
 * 
 * @route POST /docker
 * @group Docker - Docker container operations
 * @returns {object} 200 - Container started successfully
 * @returns {object} 400 - Missing required fields: 'tag' and 'type'
 * @returns {object} 500 - Failed to start container
 * @security JWT
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { tag, type } = req.machine;

    if (!tag || !type) {
      return res.status(400).json({ message: "Missing required fields: 'tag' and 'type'." });
    }

    const {
      MACHINE_BUILD_IMAGE_NAME,
      APP_ENVIRONMENT,
      APP_FIREBASE_PROJECT_ID,
      APP_FIREBASE_EMULATOR_FIRESTORE,
      APP_FIREBASE_EMULATOR_STORAGE,
      APP_FIREBASE_IPV4_ADDRESS,
      IN_DOCKER,
    } = process.env;

    if (!MACHINE_BUILD_IMAGE_NAME) {
      return res.status(500).json({ message: "Server misconfiguration: MACHINE_BUILD_IMAGE_NAME is missing." });
    }

    const envVariables = [
      `TAG=${tag}`,
      `APP_ENVIRONMENT=${APP_ENVIRONMENT}`,
      `APP_FIREBASE_PROJECT_ID=${APP_FIREBASE_PROJECT_ID}`,
      `APP_FIREBASE_EMULATOR_FIRESTORE=${APP_FIREBASE_EMULATOR_FIRESTORE}`,
      `APP_FIREBASE_IPV4_ADDRESS=${IN_DOCKER ? APP_FIREBASE_IPV4_ADDRESS : "host.docker.internal"}`,
      `APP_FIREBASE_EMULATOR_STORAGE=${APP_FIREBASE_EMULATOR_STORAGE}`,
      `CHROME_PATH=/usr/bin/chromium-browser`,
    ];

    await createAndStartContainer({
      Image: MACHINE_BUILD_IMAGE_NAME,
      name: tag,
      Env: envVariables,
      Cmd: ["npm", "run", type],
      HostConfig: {
        AutoRemove: false,
        AutoRemove: APP_ENVIRONMENT === "production",
      },
    });

    return res.json({ message: `Container '${tag}' started successfully.` });

  } catch (error) {
    console.error("Error starting container:", error);
    return res.status(500).json({ message: "Failed to start container", error: error.message });
  }
});

module.exports = router;
