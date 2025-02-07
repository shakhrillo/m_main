const envManager = require("./envManager");
const { checkDocker } = require("./docker");
const checkStripe = require("./stripe");
const checkMachine = require("./machine");
const checkFirebase = require("./firebase");
const checkServer = require("./server");
const { startLog, stopLog } = require("./logger");
const executeCompose = require("./compose");
const purge = require("./purge");

const dockerBuild = async () => {
  startLog();

  try {
    await purge();
    const env = envManager.getEnv();

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
