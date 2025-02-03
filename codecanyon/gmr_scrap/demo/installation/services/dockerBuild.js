const fs = require("fs/promises");
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

const emitMessage = (chunk) => {
  const msg = chunk.toString();
  msg && global.io.emit("docker-build", msg);
};

const executeCompose = async (config) => {
  for (const action of ["downAll", "buildAll", "upAll"]) {
    emitMessage(`Executing ${action}...`);
    await compose[action]({
      cwd: sourcePath,
      config,
      env,
      callback: (chunk) => emitMessage(chunk),
    });

    if (action === "downAll" && config === "docker-compose.yml") {
      for (const img of [
        `${process.env.PROJECT_ID}-firebase`,
        `${process.env.PROJECT_ID}-client`,
        `${process.env.PROJECT_ID}-server`,
        `${process.env.PROJECT_ID}-machine`,
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
    await fs.rm(stripeSecretsPath, { recursive: true, force: true });
    await fs.mkdir(stripeSecretsPath, { recursive: true });
    await createNetwork({ emitMessage, env });

    await executeCompose("docker-compose.yml");
    await Promise.all([
      checkStripe({ emitMessage }),
      checkFirebase({ emitMessage }),
      checkDocker({ emitMessage }),
      checkServer({ emitMessage }),
    ]);

    await executeCompose("docker-compose-machine.yml");
    await checkMachine({ emitMessage });

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
