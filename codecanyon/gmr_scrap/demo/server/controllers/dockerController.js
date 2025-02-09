const { spawn } = require("child_process");
const { docker, getDocker } = require("../docker");
const { addDockerInfo } = require("../services/firebaseService");

function infoDocker() {
  return new Promise(async (resolve, reject) => {
    try {
      const d = await getDocker();
      d.info(async function (err, data) {
        if (err) {
          reject(err);
        } else {
          await addDockerInfo({
            type: "info",
            data,
          });
          resolve(data);
        }
      });
    } catch (error) {
      console.error("Error getting docker info:", error);
      reject(error);
    }
  });
}

function removeUnusedImages() {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["system", "prune", "-a", "-f"];

    const prune = spawn(command, args);

    prune.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("Failed to remove unused images"));
      }
    });

    prune.on("error", (err) => {
      reject(err);
    });
  });
}

function startContainer(options) {
  return new Promise((resolve, reject) => {
    const d = getDocker();
    d.createContainer(options, (err, container) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      try {
        container.start((err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data);
        });
      } catch (error) {
        reject(err);
      }
    });
  });
}

async function imagesDocker() {
  return new Promise((resolve, reject) => {
    try {
      docker.listImages(async function (err, images) {
        if (err) {
          reject(err);
        } else {
          for (const image of images) {
            const details = (await docker.getImage(image.Id).inspect()) || {};
            const layers = (await docker.getImage(image.Id).history()) || [];

            const id = await addDockerInfo({
              ...image,
              data: details,
              type: "image",
            });

            layers.forEach(async (layer) => {
              await addDockerInfo({
                imageId: id,
                data: layer,
                type: "layer",
              });
            });
          }

          resolve(images);
        }
      });
    } catch (error) {
      console.error("Error getting images:", error);
      reject(error);
    }
  });
}

module.exports = {
  infoDocker,
  startContainer,
  imagesDocker,
  removeUnusedImages,
};
