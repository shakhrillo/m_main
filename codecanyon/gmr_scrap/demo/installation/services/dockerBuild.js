const fs = require("fs");
const path = require("path");
const compose = require("docker-compose");
const env = require("./env");
const { checkDocker } = require("../utils/docker");
const createNetwork = require("../utils/network");
const checkStripe = require("../utils/stripe");
const checkFirebase = require("../utils/firebase");
const checkMachine = require("../utils/machine");

const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

const executeCompose = async (config) => {
  await compose.down({ cwd: sourcePath, config, env });
  await compose.buildAll({ cwd: sourcePath, config, env });
  await compose.upAll({ cwd: sourcePath, config, env });
};

const dockerBuild = async (req, res) => {
  try {
    await fs.promises.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.promises.mkdir(stripeSecretsPath, { recursive: true });
    await createNetwork(env);

    await executeCompose("docker-compose.yml");
    await Promise.all([checkStripe(), checkFirebase(), checkDocker()]);

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
