const path = require("path");
const compose = require("docker-compose");
const { localDocker } = require("./docker");
const createNetwork = require("./network");
const { log } = require("./logger");

const sourcePath = path.resolve(__dirname, "../");

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

module.exports = executeCompose;
