require("dotenv").config();
const FIREBASE_KEY_BASE64 = process.env.FIREBASE_KEY_BASE64;
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../config/logger");
const { createEnvironment } = require("../controllers/environmentController");
const {
  buildImage,
  listContainers,
  removeContainer,
  startContainer,
} = require("../controllers/dockerController");
const { createReview } = require("../controllers/reviewController");

router.post("/", authMiddleware, async (req, res) => {
  // save new file

  res.json(req.data);
  // const { port, containerName } = generateDockerConfig();
  // executeScraping(containerName, port, scrapePageComments, req, res);
  // executeScraping(containerName, port, scraperController, req, res);
});

router.post("/info", authMiddleware, async (req, res) => {
  try {
    const { url, userId, reviewId, limit, sortBy } = req.data;

    console.log("data", req.data);

    const sanitizedUserId = userId.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const sanitizedReviewId = reviewId
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");

    createEnvironment(
      `FIREBASE_KEY_BASE64=${FIREBASE_KEY_BASE64} 
      STORAGE_BUCKET=${process.env.STORAGE_BUCKET}
      URL=${url} 
      USER_ID=${sanitizedUserId} 
      REVIEW_ID=${sanitizedReviewId} 
      LIMIT=${limit} 
      SORT_BY=${sortBy}`
    );

    // Build Docker image
    const buildTag = `r_${sanitizedUserId}_${sanitizedReviewId}`;
    console.log(`Building Docker image with tag: ${buildTag}`);
    await buildImage(buildTag);
    const lists = await listContainers();
    await Promise.all(
      lists.map(async (containerId) => {
        await removeContainer(containerId);
      })
    );
    const containerName = `r_${sanitizedUserId}_${sanitizedReviewId}`;
    const container = await startContainer(containerName, buildTag);

    await createReview(userId, {
      url,
      ...container,
    });
    res.json({ message: "Container started", ...container });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
