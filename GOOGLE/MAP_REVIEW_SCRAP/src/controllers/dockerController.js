const { exec, spawn } = require("child_process");
const logger = require("../config/logger");

/**
 * Generates a random port and container name for the Docker container.
 * @returns {Object} - The generated port and container name.
 * @property {number} port - The generated port.
 * @property {string} containerName - The generated container name.
 */
const generateDockerConfig = () => {
  const port = Math.floor(Math.random() * 10000) + 3000;
  const containerName = `browserlesschrome-${port}`;
  return { port, containerName };
};

/**
 * Runs a Docker container with the specified name and port.
 * @param {string} containerName - The name of the Docker container.
 * @param {number} port - The port to expose.
 * @param {Function} task - An optional task to run after the container is started.
 * @returns {Promise<string>} - Resolves with the container ID.
 */
const runDocker = (containerName, port, task) => {
  const dockerCommand = buildDockerCommand(containerName, port);

  return new Promise((resolve, reject) => {
    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Failed to start container: ${error.message}`);
        reject(`Failed to start container: ${error.message}`);
        return;
      }

      logger.info(`Container started with the name: ${containerName}`);
      monitorContainerLogs(containerName, port, task, resolve, reject);
    });
  });
};

/**
 * Builds the Docker run command based on the environment.
 * @param {string} containerName - The name of the Docker container.
 * @param {number} port - The port to expose.
 * @returns {string} - The Docker command.
 */
const buildDockerCommand = (containerName, port) => {
  let dockerCommand = `sudo docker run -d --name ${containerName} \
    -e PORT=${port} \
    -p ${port}:${port} \
    --memory="8g" \
    --cpus="4" \
    --platform="linux/amd64" \
    browserless/chrome`;

  if (process.env.NODE_ENV === "development") {
    dockerCommand = dockerCommand.replace("sudo ", "");
  }

  console.log(dockerCommand);

  return dockerCommand;
};

/**
 * Monitors the container logs and resolves when the container is ready.
 * @param {string} containerName - The name of the Docker container.
 * @param {number} port - The port to check for readiness.
 * @param {Function} task - The task to execute once the container is ready.
 * @param {Function} resolve - The function to resolve the promise.
 * @param {Function} reject - The function to reject the promise.
 */
const monitorContainerLogs = (containerName, port, task, resolve, reject) => {
  const logStream = spawn("docker", ["logs", "-f", containerName]);

  let isStreamKilled = false;

  const handleLogStream = (stream) => {
    stream.on("data", (data) => {
      const logOutput = data.toString();
      logger.info(logOutput);

      if (logOutput.includes(`Running on port ${port}`)) {
        isStreamKilled = true;
        logStream.kill();
        setTimeout(() => {
          handleTask(task, containerName, resolve, reject);
        }, 1000);
      }
    });

    stream.on("error", (err) => {
      logger.error(`Log stream error: ${err.message}`);
      reject(`Log stream error: ${err.message}`);
    });

    stream.on("close", (code) => {
      if (!isStreamKilled && code !== 0) {
        logger.error(`Log stream exited with code ${code}`);
        reject(`Log stream exited with code ${code}`);
      } else {
        logger.info(
          `Log stream closed with code ${code} (stream killed intentionally)`
        );
      }
    });
  };

  handleLogStream(logStream.stdout);
  handleLogStream(logStream.stderr);
};

/**
 * Handles the optional task to be executed after the container is ready.
 * @param {Function} task - The task function to run.
 * @param {string} containerName - The container name.
 * @param {Function} resolve - The function to resolve the promise.
 * @param {Function} reject - The function to reject the promise.
 */
const handleTask = (task, containerName, resolve, reject) => {
  if (task) {
    task()
      .then((result) => {
        logger.info(
          `Task completed successfully for container ${containerName}`
        );
        resolve(result);
      })
      .catch((taskError) => {
        logger.error(
          `Task failed for container ${containerName}: ${taskError.message}`
        );
        reject(`Task failed: ${taskError.message}`);
      });
  } else {
    logger.info(`No task to run for container ${containerName}`);
    resolve(containerName);
  }
};

async function removeDocker(containerName) {
  // Check if the container exists before attempting to remove it
  let checkCommand = `sudo docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`;
  if (process.env.NODE_ENV === "development") {
    checkCommand = checkCommand.replace("sudo ", "");
  }

  // Check if container exists
  const containerExists = await new Promise((resolve, reject) => {
    exec(checkCommand, (error, stdout, stderr) => {
      if (error) {
        logger.error(
          `Error checking container existence: ${stderr || error.message}`
        );
        reject(
          `Error checking container existence: ${stderr || error.message}`
        );
        return;
      }
      resolve(stdout.trim() === containerName);
    });
  });

  if (!containerExists) {
    logger.info(
      `Container ${containerName} does not exist or is already removed.`
    );
    return;
  }

  let dockerCommand = `sudo docker rm -f ${containerName}`;

  if (process.env.NODE_ENV === "development") {
    dockerCommand = dockerCommand.replace("sudo ", "");
  }

  return new Promise((resolve, reject) => {
    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Failed to remove container: ${stderr || error.message}`);
        reject(`Failed to remove container: ${stderr || error.message}`);
        return;
      }

      if (stdout.trim()) {
        logger.info(`Container removed with ID: ${stdout.trim()}`);
      } else {
        logger.info(
          "Container removal command executed, but no output returned."
        );
      }

      resolve();
    });
  });
}

module.exports = { generateDockerConfig, runDocker, removeDocker };
