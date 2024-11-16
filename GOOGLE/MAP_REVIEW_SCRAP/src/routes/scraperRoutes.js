const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const scraperController = require("../controllers/scraperController");
const scraperInfoController = require("../controllers/scraperInfoController");
const {
  runDocker,
  removeDocker,
  generateDockerConfig,
} = require("../controllers/dockerController");
const logger = require("../config/logger");

async function executeScraping(containerName, port, controller, req, res) {
  try {
    const data = await runDocker(
      containerName,
      port,
      async () => await controller(req.data, port)
    );
    await removeDocker(containerName);

    res.json(data || { message: "Scraping started" });
  } catch (error) {
    logger.error(`Error in ${controller.name} route:`, error.message);
    await removeDocker(containerName);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

router.post("/", authMiddleware, (req, res) => {
  const { port, containerName } = generateDockerConfig();
  executeScraping(containerName, port, scraperController, req, res);
});

router.post("/info", authMiddleware, (req, res) => {
  const { port, containerName } = generateDockerConfig();
  executeScraping(containerName, port, scraperInfoController, req, res);
});

module.exports = router;
