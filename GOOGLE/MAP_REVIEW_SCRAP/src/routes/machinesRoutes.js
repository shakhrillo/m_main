const fs = require("fs");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../config/logger");
const { spawn } = require("child_process");

router.post("/", authMiddleware, async (req, res) => {
  try {
    // Validate and sanitize user input
    const { url, userId, reviewId, limit, sortBy } = req.data;

    if (!url || !userId || !reviewId || !limit || !sortBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sanitizedUserId = userId.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const sanitizedReviewId = reviewId
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");

    if (!sanitizedUserId || !sanitizedReviewId) {
      return res.status(400).json({ message: "Invalid userId or reviewId" });
    }

    // Create `.env` file content
    const envContent = `
      URL=${url}
      USER_ID=${sanitizedUserId}
      REVIEW_ID=${sanitizedReviewId}
      LIMIT=${limit}
      SORT_BY=${sortBy}
    `.trim();

    const envPath = "./machines/.env";

    // Write to the `.env` file
    fs.writeFileSync(envPath, envContent, "utf8");
    logger.info("Environment file created successfully.");

    // Build Docker image
    const buildTag = `r_${sanitizedUserId}_${sanitizedReviewId}`;
    const dockerBuild = spawn(
      "docker",
      ["build", "--platform", "linux/amd64", "-t", buildTag, "."],
      { cwd: "machines" }
    );

    dockerBuild.stdout.on("data", (data) =>
      logger.info(`Docker stdout: ${data}`)
    );
    dockerBuild.stderr.on("data", (data) =>
      logger.error(`Docker stderr: ${data}`)
    );

    dockerBuild.on("close", (code) => {
      if (code === 0) {
        logger.info(`Docker build completed successfully for tag: ${buildTag}`);

        // Container name
        const containerName = `machine_${sanitizedUserId}_${sanitizedReviewId}`;

        // First, check if the container already exists and remove it
        const dockerRemove = spawn("docker", [
          "ps",
          "-aq",
          "-f",
          `name=${containerName}`,
        ]);

        dockerRemove.stdout.on("data", (data) => {
          const existingContainerId = data.toString().trim();
          if (existingContainerId) {
            logger.info(
              `Removing existing container ${containerName} with ID: ${existingContainerId}`
            );
            const dockerRm = spawn("docker", ["rm", "-f", existingContainerId]);
            dockerRm.on("close", (rmCode) => {
              if (rmCode === 0) {
                logger.info(
                  `Successfully removed existing container ${containerName}`
                );
                startContainer(containerName, buildTag); // Start new container
              } else {
                logger.error(`Failed to remove container ${containerName}`);
                res
                  .status(500)
                  .json({ message: "Failed to remove existing container" });
              }
            });
          } else {
            startContainer(containerName, buildTag); // Start new container if no existing one
          }
        });

        dockerRemove.stderr.on("data", (data) =>
          logger.error(`Error checking container: ${data}`)
        );
      } else {
        logger.error(`Docker build failed with code ${code}`);
        return res.status(500).json({ message: "Failed to build machine" });
      }
    });

    // Function to start a new container
    function startContainer(containerName, buildTag) {
      const dockerRun = spawn(
        "docker",
        [
          "run",
          "-d", // Detached mode (runs in the background)
          "--rm", // Automatically remove the container when it stops
          "--env-file",
          ".env", // Pass environment variables
          "--name",
          containerName, // Name of the container
          buildTag,
        ],
        { cwd: "machines" }
      );

      dockerRun.stdout.on("data", (data) =>
        logger.info(`Docker run stdout: ${data}`)
      );
      dockerRun.stderr.on("data", (data) =>
        logger.error(`Docker run stderr: ${data}`)
      );

      dockerRun.on("close", (runCode) => {
        if (runCode === 0) {
          logger.info(
            `Docker container ${containerName} started successfully.`
          );
          return res.status(200).json({
            message: "Machine started successfully",
            tag: buildTag,
            containerName,
          });
        } else {
          logger.error(`Failed to start Docker container with code ${runCode}`);
          return res.status(500).json({
            message: "Failed to start machine",
            tag: buildTag,
          });
        }
      });
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
