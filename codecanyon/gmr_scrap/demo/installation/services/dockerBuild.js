const fs = require("fs/promises");
const path = require("path");
const compose = require("docker-compose");
const { getEnv } = require("./env");
const { checkDocker, localDocker } = require("../utils/docker");
const createNetwork = require("../utils/network");
const checkStripe = require("../utils/stripe");
const checkMachine = require("../utils/machine");
const checkFirebase = require("../utils/firebase");
const checkServer = require("../utils/server");
const { log, startLog, stopLog } = require("./logger");

const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

const executeCompose = async ({ env, config }) => {
  for (const action of ["downAll", "buildAll", "upAll"]) {
    if (action === "buildAll" && config === "docker-compose.yml") {
      await createNetwork({ log, env });
    }

    log(`Executing ${action}...`);
    await compose[action]({
      cwd: sourcePath,
      config,
      env,
      callback: (chunk) => log(`[${action}]: ` + chunk),
    });

    if (action === "downAll" && config === "docker-compose.yml") {
      for (const img of [
        `${env.APP_ID}-firebase`,
        `${env.APP_ID}-client`,
        `${env.APP_ID}-server`,
        `${env.APP_ID}-machine`,
      ]) {
        try {
          const image = localDocker.getImage(img);
          const imageInfo = await image.inspect();

          if (imageInfo) {
            await image.remove({ force: true });
            log(`Removed image ${img}`);
          }
        } catch (err) {
          log(`No image found for ${img}`);
        }
      }
    }
  }
};

const dockerBuild = async () => {
  try {
    console.log(
      "\u001b[1m\u001b[35mGMRS: Building Docker containers...\u001b[0m"
    );
    startLog();
    const env = getEnv();

    await fs.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.mkdir(stripeSecretsPath, { recursive: true });

    await executeCompose({
      env,
      config: "docker-compose.yml",
    });

    log("Main is done!");

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

    log("Docker Compose executed successfully");
  } catch (err) {
    throw err;
  } finally {
    stopLog();
  }
};

module.exports = dockerBuild;
