const { dinDocker } = require("./docker");

/**
 * Check for Docker image
 * @param {number} retryInterval
 * @returns {Promise<import("dockerode").ImageInspectInfo>}
 */
const checkMachine = async (retryInterval = 5000) => {
  const imageName = `${process.env.PROJECT_ID}-machine`;

  while (true) {
    try {
      const image = dinDocker.getImage(imageName);
      const imageDetails = await image.inspect();
      global.io.emit("docker-build", `✅ Docker image "${imageName}" found.\n`);
      return imageDetails;
    } catch (error) {
      global.io.emit(
        "docker-build",
        `⚠️ Docker image "${imageName}" not found. Retrying in ${
          retryInterval / 1000
        }s...\n`
      );
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
};

module.exports = checkMachine;
