const compose = require("docker-compose");

/**
 * Build Docker Compose services
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const dockerBuild = async (req, res) => {
  try {
    await compose.buildAll({
      env: process.env,
      callback: (chunk) => {
        global.io.emit("docker-build", chunk.toString());
      },
    });

    res.send({
      message: "Docker Compose executed successfully",
      status: "success",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error executing Docker Compose");
  }
};

module.exports = dockerBuild;
