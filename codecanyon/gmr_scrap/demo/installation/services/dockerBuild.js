const fs = require("fs");
const path = require("path");
const compose = require("docker-compose");
const env = require("./env");
const { checkDocker, localDocker } = require("../utils/docker");
const createNetwork = require("../utils/network");
const checkStripe = require("../utils/stripe");
const checkMachine = require("../utils/machine");
const checkFirebase = require("../utils/firebase");
const checkServer = require("../utils/server");

const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

const executeCompose = async (config) => {
  await compose.downAll({
    cwd: sourcePath,
    config,
    env,
    callback: (chunk, streamSource) => {
      const data = chunk.toString();
      global.io.emit("docker-build", data);
    },
  });
  await compose.buildAll({
    cwd: sourcePath,
    config,
    env,
    callback: (chunk, streamSource) => {
      const data = chunk.toString();
      global.io.emit("docker-build", data);
    },
  });
  await compose.upAll({
    cwd: sourcePath,
    config,
    env,
    callback: (chunk, streamSource) => {
      const data = chunk.toString();
      global.io.emit("docker-build", data);
    },
  });
};

const dockerBuild = async (req, res) => {
  try {
    await fs.promises.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.promises.mkdir(stripeSecretsPath, { recursive: true });
    await createNetwork(env);

    await executeCompose("docker-compose.yml");
    await Promise.all([checkFirebase(), checkDocker(), checkServer()]);

    await executeCompose("docker-compose-machine.yml");
    await checkMachine();

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
