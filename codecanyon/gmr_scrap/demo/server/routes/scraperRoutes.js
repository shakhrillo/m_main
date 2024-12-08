require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../config/logger");
const { startContainer } = require("../controllers/dockerController");
const { db } = require("../firebase");
const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";

// Function to handle container operations
const handleContainerOperations = async (req, res, isInfo = false) => {
  try {
    const { userId, reviewId } = req.data;
    const prefix = isInfo ? overviewPrefix : reviewsPrefix;
    const buildTag = `${prefix}_${userId}_${reviewId}`.toLowerCase();

    db.doc(`machines/${buildTag}`).set({
      ...req.data,
      status: "pending",
    });

    await startContainer({
      Image: "gmr_scrap_selenium",
      name: buildTag,
      Env: [`TAG=${buildTag}`],
      Cmd: isInfo ? ["npm", "run", "info"] : ["npm", "run", "start"],
    });

    res.json({ message: "Started" });
  } catch (error) {
    console.error(error);
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
