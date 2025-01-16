const { spawn } = require("child_process");
const { docker } = require("../docker");
const { updateImages } = require("../services/firebaseService");

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
    docker.createContainer(options, (err, container) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      container.start((err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  });
}

async function imagesDocker() {
  return new Promise((resolve, reject) => {
    docker.listImages(async function (err, images) {
      if (err) {
        reject(err);
      } else {
        console.log("images", images);
        await updateImages(images);
        resolve(images);
      }
    });
  });
}

module.exports = {
  startContainer,
  imagesDocker,
  removeUnusedImages,
};
