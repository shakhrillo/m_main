const { spawn } = require("child_process");
const path = require("path");
const {
  addMachineStatus,
  updateMachineStatus,
} = require("../services/machinesService");
const { setDockerInfo, setDockerUsage } = require("../services/dockerService");
const { db } = require("../firebase");

const fs = require("fs");
const tar = require("tar-fs");
const { docker } = require("../docker");
// const { docker, dockerBuildImage } = require("../../machines/dcoker");

function dockerInfo() {
  return new Promise(async (resolve, reject) => {
    let result = "";
    const command = "docker";
    const args = ["system", "info"];

    const info = spawn(command, args);

    info.stdout.on("data", (data) => {
      result = data.toString();
    });

    info.stderr.on("data", (data) => {});

    info.on("close", async (code) => {
      if (code === 0) {
        await setDockerInfo(result);
        resolve(result);
      } else {
        reject(new Error("Failed to get Docker info"));
      }
    });

    info.on("error", (err) => {
      reject(err);
    });
  });
}

function analyzeSystem() {
  return new Promise((resolve, reject) => {
    let result = "";
    const command = "docker";
    const args = ["system", "df", "--format", "{{json .}}"];

    const analyze = spawn(command, args);

    analyze.stdout.on("data", (data) => {
      result = data.toString();
    });

    analyze.stderr.on("data", (data) => {});

    analyze.on("close", (code) => {
      if (code === 0) {
        setDockerUsage(result);
        resolve();
      } else {
        reject(new Error("Failed to analyze system"));
      }
    });

    analyze.on("error", (err) => {
      reject(err);
    });
  });
}

function removeUnusedImages() {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["system", "prune", "-a", "-f"];

    const prune = spawn(command, args);

    prune.on("close", (code) => {
      if (code === 0) {
        analyzeSystem();
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

function buildImage(tag = "") {
  return new Promise(async (resolve, reject) => {
    const buildContextPath = path.resolve(__dirname, "../../machines");
    const tarStream = tar.pack(buildContextPath, {
      ignore: function (name) {
        if (name.match(/node_modules/g)) {
          return true;
        }
      },
    });

    await docker.buildImage(
      tarStream,
      {
        dockerfile: "Dockerfile",
        t: tag,
        platform: "linux/amd64",
        forcerm: true,
      }
      // function (err, stream) {
      //   stream.setEncoding("utf8");

      //   stream.on("end", async () => {
      //     console.log(">>>Image built<<<<<");
      //     resolve();
      //   });

      //   stream.on("error", async (err) => {
      //     reject(err);
      //   });
      // }
    );
    console.log(">>>Image built<<<<<");
    resolve();
  });
}

function stopContainer(containerId) {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["stop", containerId];

    const stop = spawn(command, args);

    stop.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to stop container with ID: ${containerId}`));
      }
    });

    stop.on("error", (err) => {
      reject(err);
    });
  });
}

function removeImageById(imageId) {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["rmi", "-f", imageId];

    const remove = spawn(command, args);

    remove.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to remove image with ID: ${imageId}`));
      }
    });

    remove.on("error", (err) => {
      reject(err);
    });
  });
}

function removeImage(tag = "") {
  return new Promise(async (resolve, reject) => {
    updateMachineStatus(tag, { status: "removing" });
    const containers = await listContainers(tag);
    await Promise.all(
      containers.map(async (containerId) => {
        await stopContainer(containerId);
        await removeContainer(containerId);
      })
    );

    const images = await listImages(tag);
    await Promise.all(
      images.map(async (imageId) => {
        await removeImageById(imageId);
      })
    );

    updateMachineStatus(tag, { status: "removed" });

    resolve();
  });
}

function listContainers(query = "") {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["ps", "-aq", "-f", `name=${query}`];

    const list = spawn(command, args);

    let data = [];
    list.stdout.on("data", (chunk) => {
      data = data.concat(chunk.toString().trim().split("\n"));
    });

    list.on("close", (code) => {
      if (code === 0) {
        resolve(data);
      } else {
        reject(new Error(`Failed to list containers with query: ${query}`));
      }
    });

    list.on("error", (err) => {
      reject(err);
    });
  });
}

function listImages(query = "") {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["images", "-q", query];

    const list = spawn(command, args);

    let data = [];
    list.stdout.on("data", (chunk) => {
      data = data.concat(chunk.toString().trim().split("\n"));
    });

    list.on("close", (code) => {
      if (code === 0) {
        resolve(data);
      } else {
        reject(new Error(`Failed to list images with query: ${query}`));
      }
    });

    list.on("error", (err) => {
      reject(err);
    });
  });
}

function removeContainer(containerId) {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["rm", "-f", containerId];

    const remove = spawn(command, args);

    remove.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        // reject(new Error(`Failed to remove container with ID: ${containerId}`));
        resolve();
      }
    });

    remove.on("error", (err) => {
      reject(err);
    });
  });
}

function startContainer(containerName, buildTag, envArray) {
  return new Promise((resolve, reject) => {
    docker.createContainer(
      {
        Image: buildTag,
        name: containerName,
        Env: envArray,
        Cmd: ["npm", "run", "info"],
      },
      function (err, container) {
        if (err) {
          reject(err);
        }

        container.start(function (err, data) {
          if (err) {
            reject(err);
          }

          resolve({ containerName, buildTag });
        });
      }
    );
  });
}

module.exports = {
  dockerInfo,
  analyzeSystem,
  buildImage,
  removeImage,
  listContainers,
  removeContainer,
  startContainer,
  removeUnusedImages,
};
