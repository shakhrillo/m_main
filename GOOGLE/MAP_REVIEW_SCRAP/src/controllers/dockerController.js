const { exec, spawn } = require("child_process");
const logger = require("../config/logger");

/**
 * Runs a Docker container with the specified name and port.
 * @param {string} containerName - The name of the Docker container.
 * @param {number} port - The port to expose.
 * @param {Function} task - An optional task to run after the container is started.
 * @returns {Promise<string>} - Resolves with the container ID.
 */
const runDocker = (containerName, port, task) => {
  let dockerCommand = `sudo docker run -d --name ${containerName} \
    -e PORT=${port} \
    -p ${port}:${port} \
    browserless/chrome`;

  if (process.env.NODE_ENV === "development") {
    dockerCommand = dockerCommand.replace("sudo ", "");
  }

  return new Promise((resolve, reject) => {
    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Failed to start container: ${error.message}`);
        reject(`Failed to start container: ${error.message}`);
        return;
      }

      logger.info(`Container started with the name: ${containerName}`);

      // Monitor logs for the specific text
      const logStream = spawn("docker", ["logs", "-f", containerName]);
      const handleLogStream = (
        stream,
        port,
        containerName,
        task,
        resolve,
        logger
      ) => {
        stream.on("data", (data) => {
          const logOutput = data.toString();
          logger.info(logOutput);

          if (logOutput.includes(`Running on port ${port}`)) {
            // Stop listening to logs with success
            logStream.kill();
            setTimeout(() => {
              if (task) {
                task().then(resolve).catch(reject);
              } else {
                resolve(containerName); // Resolve the promise
              }
            }, 5000);
          }
        });
      };

      // Usage
      handleLogStream(
        logStream.stdout,
        port,
        containerName,
        task,
        resolve,
        logger
      );
      handleLogStream(
        logStream.stderr,
        port,
        containerName,
        task,
        resolve,
        logger
      );
    });
  });
};

/**
 * Removes a Docker container by its name, based on the provided port.
 * @param {number} port - The port associated with the Docker container.
 * @returns {Promise<void>} - Resolves when the container is removed.
 */
async function removeDocker(port) {
  const containerName = `browserlesschrome-${port}`;
  let dockerCommand = `sudo docker rm -f ${containerName}`;

  if (process.env.NODE_ENV === "development") {
    dockerCommand = dockerCommand.replace("sudo ", "");
  }

  return new Promise((resolve, reject) => {
    exec(dockerCommand, (error, stdout) => {
      if (error) {
        logger.error(`Failed to remove container: ${error.message}`);
        reject(`Failed to remove container: ${error.message}`);
        return;
      }

      logger.info(`Container removed with ID: ${stdout.trim()}`);
      resolve();
    });
  });
}

module.exports = { runDocker, removeDocker };
