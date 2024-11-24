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
  removeImage,
} = require("../controllers/dockerController");

router.post("/", authMiddleware, async (req, res) => {
  let buildTag;
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
      USER_ID=${userId}
      REVIEW_ID=${reviewId}
      LIMIT=${limit} 
      SORT_BY=${sortBy}`,
      "./machines/.env.main"
    );

    // Build Docker image
    buildTag = `r_${sanitizedUserId}_${sanitizedReviewId}`;
    console.log(`Building Docker image with tag: ${buildTag}`);
    await buildImage(buildTag);
    // const lists = await listContainers();
    // await Promise.all(
    //   lists.map(async (containerId) => {
    //     await removeContainer(containerId);
    //   })
    // );
    const containerName = `r_${sanitizedUserId}_${sanitizedReviewId}`;
    const container = await startContainer(containerName, buildTag);

    res.json({ message: "Container started", ...container });
  } catch (error) {
    console.log("error is here", error);
    logger.error(`Error>>>>>: ${error.message}`);
    if (buildTag) {
      await removeImage(buildTag);
    }
    res.status(500).json({ message: "Internal server errorsss" });
  }
});

router.post("/info", authMiddleware, async (req, res) => {
  let buildTag;
  try {
    const { url, userId, reviewId, limit, sortBy } = req.data;

    console.log("data-->", req.data);

    const sanitizedUserId = userId.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const sanitizedReviewId = reviewId
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");

    createEnvironment(
      `FIREBASE_KEY_BASE64=${FIREBASE_KEY_BASE64} 
      STORAGE_BUCKET=${process.env.STORAGE_BUCKET}
      URL=${url} 
      USER_ID=${userId}
      REVIEW_ID=${reviewId}
      LIMIT=${limit} 
      SORT_BY=${sortBy}
      GCLOUD_PROJECT=fir-scrapp
      FIRESTORE_EMULATOR_HOST=host.docker.internal:9100
      FIREBASE_AUTH_EMULATOR_HOST=host.docker.internal:9099
      STORAGE_EMULATOR_HOST=host.docker.internal:9199
      FIREBASE_STORAGE_EMULATOR_HOST=host.docker.internal:9199
      `
    );

    // Build Docker image
    buildTag = `c_${sanitizedUserId}_${sanitizedReviewId}`;
    console.log(`Building Docker image with tag: ${buildTag}`);
    await buildImage(buildTag, true);

    const containerName = `c_${sanitizedUserId}_${sanitizedReviewId}`;
    const container = await startContainer(containerName, buildTag, false);

    await removeImage(buildTag);

    console.log(containerName);

    res.json({ message: "Container started", ...container });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    if (buildTag) {
      await removeImage(buildTag);
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
