const purge = require("./purge");
const envManager = require("./envManager");
const executeCompose = require("./composeRunner");
const { checkDocker } = require("./docker");
const checkStripe = require("./stripe");
const checkMachine = require("./machine");
const checkFirebase = require("./firebase");
const checkServer = require("./server");
const { startLog, stopLog } = require("./logger");
envManager.getEnv();
require("dotenv").config();

/**
 * Build the Docker containers
 *
 * @returns {Promise<void>}
 * @throws {Error}
 *
 */
const dockerBuild = async () => {
  startLog();

  try {
    await purge();

    await executeCompose({
      config: "docker-compose.yml",
    });

    await Promise.all([
      await checkDocker(),
      await checkStripe(),
      await checkFirebase(),
      await checkServer(),
    ]);

    await executeCompose({
      config: "docker-compose-machine.yml",
    });

    await checkMachine();
  } catch (err) {
    throw err;
  } finally {
    stopLog();
  }
};

module.exports = dockerBuild;
