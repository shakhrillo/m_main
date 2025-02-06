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

const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");
const ora = require("ora");
const spinner = ora({
  spinner: "dots",
  color: "cyan",
});

const emitMessage = (chunk) => {
  spinner.text = chunk;
  fs.appendFile(path.join(sourcePath, "docker-build.log"), chunk);
};

const executeCompose = async ({ env, config }) => {
  for (const action of ["downAll", "buildAll", "upAll"]) {
    if (action === "buildAll" && config === "docker-compose.yml") {
      await createNetwork({ emitMessage, env });
    }

    emitMessage(`Executing ${action}...`);
    await compose[action]({
      cwd: sourcePath,
      config,
      env,
      callback: (chunk) => emitMessage(`[${action}]: ` + chunk),
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
            emitMessage(`Removed image ${img}`);
          }
        } catch (err) {
          emitMessage(`No image found for ${img}`);
        }
      }
    }
  }
};

const dockerBuild = async () => {
  try {
    spinner.start("Building Docker containers...");
    const env = getEnv();
    await fs.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.mkdir(stripeSecretsPath, { recursive: true });

    await executeCompose({
      env,
      config: "docker-compose.yml",
    });

    emitMessage("Main is done!");

    await checkStripe({ env, emitMessage });
    await checkFirebase({ env, emitMessage });
    await checkDocker({ env, emitMessage });
    await checkServer({ env, emitMessage });

    await executeCompose({
      env,
      config: "docker-compose-machine.yml",
    });
    await checkMachine({ env, emitMessage });

    emitMessage("Docker Compose executed successfully");
  } catch (err) {
    throw err;
  } finally {
    spinner.stop();
  }
};

module.exports = dockerBuild;
