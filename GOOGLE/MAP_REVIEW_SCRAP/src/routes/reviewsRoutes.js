const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const scraperController = require("../controllers/scraperController");
const scraperInfoController = require("../controllers/scraperInfoController");
const { runDocker, removeDocker } = require("../controllers/dockerController");
const logger = require("../config/logger");

// Constants
const DELAY_MS = 5000; // Delay for container initialization

// Helper function to manage Docker setup and teardown
const withDocker = async (port, containerName, task) => {
  const containerId = await runDocker(containerName, port);
  try {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS)); // Wait for container initialization
    return await task();
  } finally {
    await removeDocker(port);
  }
};

// Routes
router.post("/", authMiddleware, async (req, res) => {
  const port = Math.floor(Math.random() * 10000) + 3000;
  const containerName = `browserlesschrome-${port}`;

  try {
    const result = await withDocker(port, containerName, async () => {
      await scraperController(req.data, port);
      return req.data;
    });
    res.json(result);
  } catch (error) {
    logger.error("Error in / route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/info", authMiddleware, async (req, res) => {
  const port = Math.floor(Math.random() * 10000) + 3000;
  const containerName = `browserlesschrome-${port}`;
  logger.info("Received request to /info route");

  try {
    const data = await runDocker(
      containerName,
      port,
      async () => await scraperInfoController(req.data, port)
    );
    res.json(data);
  } catch (error) {
    logger.error("Error in /info route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
