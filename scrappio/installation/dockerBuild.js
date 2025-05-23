const executeCompose = require("./composeRunner");
const { checkDocker } = require("./docker");
const checkStripe = require("./stripe");
const checkMachine = require("./machine");
const checkFirebase = require("./firebase");
const checkServer = require("./server");
const { startLog, stopLog } = require("./logger");
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
    await executeCompose({
      config: "docker-compose.yml",
    });

    await checkFirebase();
    await checkDocker();
    if(process.env.APP_ENVIRONMENT === "development") {
      await checkStripe();
    }
    await checkServer();

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
