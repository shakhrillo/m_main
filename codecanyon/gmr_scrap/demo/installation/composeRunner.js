const path = require("path");
const compose = require("docker-compose");
const { log } = require("./logger");

const { localDocker } = require("./docker");
const createNetwork = require("./network");

const sourcePath = path.resolve(__dirname, "../");

const executeCompose = async ({ env, config }) => {
  // for (const action of ["downAll", "buildAll", "upAll"]) {
  for (const action of ["buildAll", "upAll"]) {
    if (action === "buildAll" && config === "docker-compose.yml") {
      await createNetwork({ log, env });
    }

    await compose[action]({
      cwd: sourcePath,
      config,
      env,
      callback: (chunk) => log(chunk),
    });

    if (action === "downAll" && config === "docker-compose.yml") {
      continue;
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
          }
        } catch (err) {
          log(`No image found for ${img}`);
        }
      }
    }
  }
};

module.exports = executeCompose;
