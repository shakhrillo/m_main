const { spawn } = require("child_process");

function buildImage(tag = "") {
  return new Promise(async (resolve, reject) => {
    await removeImage(tag);

    // wait 2 sec
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const build = spawn(
      "docker",
      // rm dangling images
      ["build", "--platform", "linux/amd64", "-t", tag, ".", "--force-rm"],
      // ["build", "--platform", "linux/amd64", "-t", tag, "."],
      {
        cwd: "machines",
      }
    );

    build.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    build.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    build.on("close", (code) => {
      if (code === 0) {
        console.log(`Docker build completed successfully for tag: ${tag}`);
        resolve();
      } else {
        console.error(`Docker build failed for tag: ${tag}`);
        reject(new Error(`Docker build failed for tag: ${tag}`));
      }
    });
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

function removeImage(tag = "") {
  return new Promise(async (resolve, reject) => {
    const containers = await listContainers(tag);
    console.log("containers>>>", containers);
    await Promise.all(
      containers.map(async (containerId) => {
        console.log("container", containerId);
        await stopContainer(containerId);
        await removeContainer(containerId);
      })
    );
    if (!containers.length) {
      resolve();
    } else {
      const remove = spawn("docker", ["rmi", tag]);

      remove.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      remove.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      remove.on("close", (code) => {
        if (code === 0) {
          console.log(`Removed image with tag: ${tag}`);
          resolve();
        } else {
          console.error(`Failed to remove image with tag: ${tag}`);
          reject(new Error(`Failed to remove image with tag: ${tag}`));
        }
      });
    }
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
function startContainer(containerName, buildTag) {
  return new Promise((resolve, reject) => {
    const command = "docker";
    const args = [
      "run",
      "-d", // Detached mode (runs in the background)
      "--rm", // Automatically remove the container when it stops
      "--env-file",
      ".env", // Pass environment variables
      "--name",
      containerName,
      buildTag,
    ];

    const start = spawn(command, args, {
      cwd: "machines",
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
