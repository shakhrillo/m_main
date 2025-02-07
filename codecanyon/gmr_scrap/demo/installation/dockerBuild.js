const purge = require("./purge");
const envManager = require("./envManager");
const executeCompose = require("./composeRunner");
const { checkDocker } = require("./docker");
const checkStripe = require("./stripe");
const checkMachine = require("./machine");
const checkFirebase = require("./firebase");
const checkServer = require("./server");
const { startLog, stopLog } = require("./logger");

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
    const env = envManager.getEnv();

    await executeCompose({
      env,
      config: "docker-compose.yml",
    });

    await new Promise((resolve) => setTimeout(resolve, 500000000));

    await Promise.all([
      await checkDocker(),
      await checkStripe(),
      await checkFirebase(),
      await checkServer(),
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
