const compose = require("docker-compose");
const env = require("./env");

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
      env,
      callback: (chunk) => {
        global.io.emit("docker-build", chunk.toString());
      },
    });

    res.send({
      message: "Docker Compose executed successfully",
      status: "success",
    });
  } catch (err) {
    console.error("Error executing Docker Compose:", err);
    res.status(500).send({
      message: "Error executing Docker Compose",
      error: err.toString(),
    });
  }
};

module.exports = dockerBuild;
