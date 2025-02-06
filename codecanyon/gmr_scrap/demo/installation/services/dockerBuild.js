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

const emitMessage = (chunk) => {
  const msg = chunk.toString();
  msg && global.io.emit("docker-build", msg);
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
          console.log("No image found for", img);
          emitMessage(`No image found for ${img}`);
        }
      }
    }
  }
};

const dockerBuild = async (req, res) => {
  try {
    const env = getEnv();
    console.log("Env:", env);
    return;
    await fs.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.mkdir(stripeSecretsPath, { recursive: true });

    await executeCompose({
      env,
      config: "docker-compose.yml",
    });

    emitMessage("Main is done!");

    // await Promise.all([
    await checkStripe({ env, emitMessage });
    console.log("checkStripe done!");
    await checkFirebase({ env, emitMessage });
    console.log("checkFirebase done!");
    await checkDocker({ env, emitMessage });
    console.log("checkDocker done!");
    await checkServer({ env, emitMessage });
    console.log("checkServer done!");
    // ]);

    await executeCompose({
      env,
      config: "docker-compose-machine.yml",
    });
    await checkMachine({ env, emitMessage });

    emitMessage("Docker Compose executed successfully");
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
