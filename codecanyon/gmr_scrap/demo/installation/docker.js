const fs = require("fs");
const os = require("os");
const Docker = require("dockerode");
const { log } = require("./logger");

let dockerSocketPath = "/var/run/docker.sock";
if (os.platform() === "win32") {
  dockerSocketPath = "tcp://localhost:2375";
}

const localDocker = new Docker({
  socketPath: dockerSocketPath,
});

let dinDocker;

const checkDockerConnection = async () => {
  log("Waiting for Docker...");
  while (true) {
    try {
      dinDocker = new Docker({
        protocol: "https",
        host: process.env.DOCKER_HOST || "localhost",
        port: process.env.DOCKER_PORT || 2376,
        ca: fs.readFileSync("./certs/client/ca.pem"),
        cert: fs.readFileSync("./certs/client/cert.pem"),
        key: fs.readFileSync("./certs/client/key.pem"),
      });

      await dinDocker.ping();

      log("Connected to Docker");
      return true;
    } catch (error) {
      log("Waiting for Docker...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

/**
 * Check for Docker
 * @returns {Promise<boolean>}
 */
const checkDocker = async ({ env }) => {
  return new Promise(async (resolve, reject) => {
    log("[docker]: " + "Checking Docker...");
    await checkDockerConnection();

    const container = localDocker.getContainer(`${env.APP_ID}-docker`);

    container.inspect(async (err, data) => {
      if (err) {
        log("[docker]: " + err);
        reject(err);
        return;
      }

      container.logs(
        {
          follow: true,
          stdout: true,
          stderr: true,
        },
        (err, stream) => {
          if (err) {
            log("[docker]: " + err);
            reject(err);
            return;
          }

          const handleData = async (chunk) => {
            log("[docker]: " + chunk);

            if (
              chunk.toString().includes("Daemon has completed initialization")
            ) {
              stream.removeListener("data", handleData);
              stream.destroy();
              try {
                await dinDocker.pruneContainers({
                  all: true,
                  force: true,
                });
                await dinDocker.pruneImages({
                  all: true,
                  force: true,
                });
                await dinDocker.pruneVolumes({
                  force: true,
                });
                await dinDocker.pruneNetworks({
                  force: true,
                });
                log("[docker]: " + "Docker daemon is ready.");
                resolve(true);
              } catch (err) {
                log("[docker]: " + err);
                reject(err);
              }
            }
          };

          stream.on("data", handleData);
        }
      );
    });
  });
};

module.exports = {
  dinDocker,
  localDocker,
  checkDocker,
};
