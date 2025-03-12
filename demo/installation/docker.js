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

/**
 * Check Docker connection
 * @returns {Promise<boolean>}
 */
const checkDockerConnection = async () => {
  while (true) {
    try {
      dinDocker = new Docker({
        protocol: "https",
        host: "localhost",
        port: 2376,
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
const checkDocker = async () => {
  return new Promise(async (resolve, reject) => {
    await checkDockerConnection();

    const container = localDocker.getContainer(`${process.env.APP_ID}-docker`);

    container.inspect(async (err, data) => {
      if (err) {
        log(err);
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
            log(err);
            reject(err);
            return;
          }

          const handleData = async (chunk) => {
            log(chunk);

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
                resolve(true);
              } catch (err) {
                log(err);
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
