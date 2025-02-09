const path = require("path");
const compose = require("docker-compose");
const { log } = require("./logger");

const { localDocker } = require("./docker");
const createNetwork = require("./network");

const sourcePath = path.resolve(__dirname, "../");

const executeCompose = async ({ config }) => {
  for (const action of ["downAll", "buildAll", "upAll"]) {
    if (action === "buildAll" && config === "docker-compose.yml") {
      await createNetwork({ log });
    }

    await compose[action]({
      cwd: sourcePath,
      config,
      env: process.env,
      callback: (chunk) => log(chunk),
    });

    if (action === "downAll" && config === "docker-compose.yml") {
      for (const img of [
        `${process.env.APP_ID}-firebase`,
        `${process.env.APP_ID}-client`,
        `${process.env.APP_ID}-server`,
        `${process.env.APP_ID}-machine`,
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
