const fs = require("fs/promises");
const path = require("path");
const { getEnv } = require("./env");
const { checkDocker } = require("../utils/docker");
const checkStripe = require("../utils/stripe");
const checkMachine = require("../utils/machine");
const checkFirebase = require("../utils/firebase");
const checkServer = require("../utils/server");
const { startLog, stopLog } = require("./logger");
const executeCompose = require("./compose");

const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

const dockerBuild = async () => {
  try {
    startLog();
    const env = getEnv();

    await fs.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.mkdir(stripeSecretsPath, { recursive: true });

    await executeCompose({
      env,
      config: "docker-compose.yml",
    });

    await Promise.all([
      await checkStripe({ env }),
      await checkFirebase({ env }),
      await checkDocker({ env }),
      await checkServer({ env }),
    ]);

    await executeCompose({
      env,
      config: "docker-compose-machine.yml",
    });

    await checkMachine({ env });
  } catch (err) {
    throw err;
  } finally {
    stopLog();
  }
};

module.exports = dockerBuild;
