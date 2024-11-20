const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const scraperController = require("../controllers/scraperController");
const { scrapePageData } = require("../controllers/scrapePageDataController");
const {
  runDocker,
  removeDocker,
  generateDockerConfig,
} = require("../controllers/dockerController");
const logger = require("../config/logger");
const scrapePageComments = require("../controllers/scrapePageCommentsController");

async function executeScraping(containerName, port, controller, req, res) {
  try {
    const data = await runDocker(
      containerName,
      port,
      async () => await controller(req.data, port, containerName)
    );
    await removeDocker(containerName);

    res.json(data || { message: "Scraping started" });
  } catch (error) {
    logger.error(`Error in ${controller.name} route:`, error.message);
    await removeDocker(containerName);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

router.post("/", authMiddleware, async (req, res) => {
  // save new file

  res.json(req.data);
  // const { port, containerName } = generateDockerConfig();
  // executeScraping(containerName, port, scrapePageComments, req, res);
  // executeScraping(containerName, port, scraperController, req, res);
});

router.post("/info", authMiddleware, (req, res) => {
  res.json({ message: "Scraping info" });
  // const { port, containerName } = generateDockerConfig();
  // executeScraping(containerName, port, scrapePageData, req, res);
});

module.exports = router;
