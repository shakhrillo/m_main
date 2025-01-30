const fs = require("fs");
const path = require("path");
const compose = require("docker-compose");
const env = require("./env");
const checkStripe = require("../utils/stripe");
const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

/**
 * Build Docker Compose services
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const dockerBuild = async (req, res) => {
  try {
    await fs.promises.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.promises.mkdir(stripeSecretsPath, { recursive: true });

    await compose.buildAll({
      env,
      callback: (chunk) => {
        global.io.emit("docker-build", chunk.toString());
      },
    });

    await compose.down({
      env,
      callback: (chunk) => {
        global.io.emit("docker-build", chunk.toString());
      },
    });

    await compose.upAll({
      env,
      callback: (chunk) => {
        global.io.emit("docker-build", chunk.toString());
      },
    });

    await checkStripe();

    global.io.emit("docker-build", "Docker Compose executed successfully \n");

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
