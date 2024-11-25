const { spawn } = require("child_process");
const path = require("path");
const {
  addMachineStatus,
  updateMachineStatus,
} = require("../services/machinesService");

function buildImage(tag = "", isInfo = false) {
  return new Promise(async (resolve, reject) => {
    await addMachineStatus(tag, { status: "building" });
    await removeImage(tag);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const command = "docker";
      const args = [
        "build",
        "-f",
        isInfo ? "Dockerfile.info" : "Dockerfile",
        "--platform",
        "linux/amd64",
        "-t",
        tag,
        ".",
        "--force-rm",
      ];

      const build = spawn(command, args, {
        cwd: "../machines",
      });

      build.stdout.on("data", (data) => {
        updateMachineStatus(tag, { status: "building", message: data });
        console.log(`stdout: ${data}`);
      });

      build.stderr.on("data", (data) => {
        updateMachineStatus(tag, { status: "building", message: data });
        console.error(`stderr: ${data}`);
      });

      build.on("close", (code) => {
        if (code === 0) {
          updateMachineStatus(tag, { status: "built" });
          console.log(`Docker build completed successfully for tag: ${tag}`);
          resolve();
        } else {
          updateMachineStatus(tag, { status: "failed" });
          console.error(`Docker build failed for tag: ${tag}`);
          reject(new Error(`Docker build failed for tag: ${tag}`));
        }
      });
    } catch (error) {
      console.log("--".repeat(50));
      console.log("error", error);
      updateMachineStatus(tag, { status: "failed" });
      reject(error);
    }
  });
}

function stopContainer(containerId) {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = ["stop", containerId];

    const stop = spawn(command, args);

    stop.on("close", (code) => {
      if (code === 0) {
        console.log(`Stopped container with ID: ${containerId}`);
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
        console.log(`Removed image with ID: ${imageId}`);
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
    console.log("containers>>>", containers);
    await Promise.all(
      containers.map(async (containerId) => {
        console.log("container", containerId);
        await stopContainer(containerId);
        await removeContainer(containerId);
      })
    );

    const images = await listImages(tag);
    console.log("images>>>", images);
    await Promise.all(
      images.map(async (imageId) => {
        console.log("image", imageId);
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
      console.log("chunk", chunk.toString());
      data = data.concat(chunk.toString().trim().split("\n"));
    });

    list.on("close", (code) => {
      console.log("code", code);
      if (code === 0) {
        resolve(data);
      } else {
        reject(new Error(`Failed to list containers with query: ${query}`));
      }
    });

    list.on("error", (err) => {
      console.log("err", err);
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
        console.log(`Removed container with ID: ${containerId}`);
        resolve();
      } else {
        reject(new Error(`Failed to remove container with ID: ${containerId}`));
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
  envFile = ".env"
) {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = [
      "run",
      ...(isRunBackground ? ["-d"] : []), // Detached mode (runs in the background)
      // "--rm", // Automatically remove the container when it stops
      "--env-file",
      // ".env", // Pass environment variables
      envFile,
      "--name",
      containerName,
      buildTag,
    ];

    const start = spawn(command, args, {
      cwd: "../machines",
    });

    start.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    start.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    start.on("close", (code) => {
      if (code === 0) {
        console.log(`Started container with name: ${containerName}`);
        resolve({ containerName, buildTag });
      } else {
        reject(
          new Error(`Failed to start container with name: ${containerName}`)
        );
      }
    });
  });
}

module.exports = {
  buildImage,
  removeImage,
  listContainers,
  removeContainer,
  startContainer,
};
