require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../config/logger");
const { createEnvironment } = require("../controllers/environmentController");
const {
  buildImage,
  startContainer,
  removeImage,
  removeUnusedImages,
} = require("../controllers/dockerController");
const { db } = require("../firebase");

// Helper function for sanitization
const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9_-]/g, "");

// Function to handle container operations
const handleContainerOperations = async (req, res, isInfo = false) => {
  let buildTag;
  try {
    const { url, userId, reviewId, limit, sortBy } = req.data;
    const sanitizedUserId = userId.toLowerCase();
    const sanitizedReviewId = reviewId.toLowerCase();

    const containerName = `${
      isInfo ? "info" : "comments"
    }_${sanitizedUserId}_${sanitizedReviewId}`;
    buildTag = containerName;
    console.log("buildTag", buildTag);

    const envArray = [
      `IS_INFO=${isInfo}`,
      `FIREBASE_KEY_BASE64=${process.env.FIREBASE_KEY_BASE64}`,
      `HOSTNAME=${buildTag}`,
      `STORAGE_BUCKET=${process.env.STORAGE_BUCKET}`,
      `URL=${url}`,
      `USER_ID=${userId}`,
      `REVIEW_ID=${reviewId}`,
      `LIMIT=${limit}`,
      `SORT_BY=${sortBy}`,
      `GCLOUD_PROJECT=fir-scrapp`,
      `FIRESTORE_EMULATOR_HOST=host.docker.internal:9100`,
      `FIREBASE_AUTH_EMULATOR_HOST=host.docker.internal:9099`,
      `STORAGE_EMULATOR_HOST=host.docker.internal:9199`,
      `FIREBASE_STORAGE_EMULATOR_HOST=host.docker.internal:9199`,
    ];

    const ref = `users/${userId}/reviewOverview/${reviewId}/status`;
    // tag: buildTag,
    //   url,
    //   userId,
    //   reviewId,
    db.doc(`machines/${buildTag}`).set({
      url,
      userId,
      reviewId,
      limit,
      sortBy,
    });
    await buildImage(buildTag);
    // await startContainer(containerName, buildTag, envArray);

    res.json({ message: "Started" });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    if (buildTag) await removeImage(buildTag);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Routes
router.post("/", authMiddleware, (req, res) =>
  handleContainerOperations(req, res)
);
router.post("/info", authMiddleware, (req, res) =>
  handleContainerOperations(req, res, true)
);

module.exports = router;
