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

function buildImage(tag = "", isInfo = false, ref) {
  return new Promise(async (resolve, reject) => {
    const buildContextPath = path.resolve(__dirname, "../../machines");
    const tarStream = tar.pack(buildContextPath, {
      ignore: function (name) {
        // ignore node_modules
        if (name.match(/node_modules/g)) {
          return true;
        }
      },
    });

    console.log("--->", tag);

    docker.buildImage(
      tarStream,
      {
        dockerfile: "Dockerfile",
        t: tag,
        platform: "linux/amd64",
        forcerm: true,
      },
      function (err, stream) {
        stream.setEncoding("utf8");
        stream.on("data", async (data) => {
          console.log("ooooooo>", data);
        });

        stream.on("end", async () => {
          console.log("Image built");
          resolve();
        });

        stream.on("error", async (err) => {
          console.log("->>>", err);
          // reject(err);
        });
      }
    );

    // await dockerBuildImage(tag, isInfo);

    // const relativePath =

    // console.log("Context Path:", path.resolve(__dirname, "../machines"));
    // console.log("Dockerfile:", isInfo ? "Dockerfile.info" : "Dockerfile");

    // await docker.buildImage(
    //   {
    //     context: path.resolve(__dirname, "../../machines"),
    //     src: ["Dockerfile"],
    //   },
    //   {
    //     dockerfile: "Dockerfile",
    //     platform: "linux/amd64",
    //     t: tag,
    //     forcerm: true,
    //   },
    //   (err, stream) => {
    //     if (err) {
    //       console.log("err", err);
    //       // updateMachineStatus(tag, {
    //       //   status: "failed",
    //       //   message: JSON.stringify(err),
    //       // });
    //       // reject(err);
    //     }

    //     // console.log("err", err);
    //     // console.log("stream", stream);

    //     stream.setEncoding("utf8");
    //     stream.on("data", async (data) => {
    //       console.log("data", data);
    //       // await db.collection(ref).add({
    //       //   status: "building",
    //       //   createdAt: new Date(),
    //       //   message: "data",
    //       // });
    //     });

    //     stream.on("end", () => {
    //       updateMachineStatus(tag, { status: "built" });
    //       resolve();
    //     });
    //   }
    // );

    // try {
    //   const command = "docker";
    //   const args = [
    //     "build",
    //     "-f",
    //     isInfo ? "Dockerfile.info" : "Dockerfile",
    //     "--platform",
    //     "linux/amd64",
    //     "-t",
    //     tag,
    //     ".",
    //   ];

    //   const build = spawn(command, args, {
    //     cwd: "../machines",
    //   });

    //   build.stdout.on("data", async (data) => {
    //     await db.collection(ref).add({
    //       status: "building",
    //       createdAt: new Date(),
    //       message: data.toString(),
    //     });
    //   });

    //   build.stderr.on("data", async (data) => {
    //     await db.collection(ref).add({
    //       status: "building",
    //       createdAt: new Date(),
    //       message: data.toString(),
    //     });
    //   });

    //   build.on("close", (code) => {
    //     if (code === 0) {
    //       updateMachineStatus(tag, { status: "built" });
    //       resolve();
    //     } else {
    //       updateMachineStatus(tag, { status: "failed" });
    //       reject(new Error(`Docker build failed for tag: ${tag}`));
    //     }
    //   });
    // } catch (error) {
    //   updateMachineStatus(tag, {
    //     status: "failed",
    //     message: JSON.stringify(error),
    //   });
    //   reject(error);
    // }
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

function startContainer(
  containerName,
  buildTag,
  isRunBackground = true,
  envArray
) {
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
          console.log("err___", err);
          // reject(err);
        }

        console.log("--".repeat(10));
        console.log(
          JSON.stringify({
            Image: buildTag,
            name: containerName,
            Env: envArray,
            Cmd: ["node", "info.js"],
          })
        );
        console.log("--".repeat(10));

        console.log("container", container.id);

        container.start(function (err, data) {
          if (err) {
            console.log("err___", err);
            // reject(err);
          }

          if (data) {
            console.log("data___", data);
          }

          resolve({ containerName, buildTag });
        });

        // docker.startContainer(containerName, function (err, data) {
        //   if (err) {
        //     reject(err);
        //   }

        //   resolve({ containerName, buildTag });
        // });

        // container.start(function (err, data) {
        //   if (err) {
        //     reject(err);
        //   }

        //   resolve({ containerName, buildTag });
        // });
      }
    );

    // const command = "docker";
    // const args = [
    //   "run",
    //   ...(isRunBackground ? ["-d"] : []), // Detached mode (runs in the background)
    //   // "--rm", // Automatically remove the container when it stops
    //   "--env-file",
    //   // ".env", // Pass environment variables
    //   envFile,
    //   "--name",
    //   containerName,
    //   buildTag,
    // ];

    // const start = spawn(command, args, {
    //   cwd: "../machines",
    // });

    // start.stdout.on("data", (data) => {});

    // start.stderr.on("data", (data) => {});

    // start.on("close", (code) => {
    //   if (code === 0) {
    //     resolve({ containerName, buildTag });
    //   } else {
    //     reject(
    //       new Error(`Failed to start container with name: ${containerName}`)
    //     );
    //   }
    // });
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
