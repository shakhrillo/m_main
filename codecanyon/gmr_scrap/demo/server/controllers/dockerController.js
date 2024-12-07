const { spawn } = require("child_process");
const { docker } = require("../docker");

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

function startContainer(containerName, envArray, cmd) {
  return new Promise((resolve, reject) => {
    docker.createContainer(
      {
        Image: "gmr_scrap_selenium",
        name: containerName,
        Env: envArray,
        Cmd: cmd,
        HostConfig: {
          // AutoRemove: true,
        },
      },
      function (err, container) {
        if (err) {
          reject(err);
        }

        container.start(function (err, data) {
          if (err) {
            reject(err);
          }

          resolve({ containerName });
        });
      }
    );
  });
}

module.exports = {
  startContainer,
  removeUnusedImages,
};
