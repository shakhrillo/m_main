const os = require("os");
const Docker = require("dockerode");
let dockerSocketPath = "/var/run/docker.sock";
if (os.platform() === "win32") {
  dockerSocketPath = "tcp://localhost:2375";
}
const dinDocker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "localhost",
  port: process.env.DOCKER_PORT || 2375,
});

const localDocker = new Docker({
  socketPath: dockerSocketPath,
});

/**
 * Check for Docker
 * @returns {Promise<boolean>}
 */
const checkDocker = async ({ emitMessage }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer("gmrsx-docker");

    container.inspect(async (err, data) => {
      if (err) {
        emitMessage(err);
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
            emitMessage(err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            emitMessage(chunk);

            if (
              chunk.toString().includes("Daemon has completed initialization")
            ) {
              stream.removeListener("data", handleData);
              stream.destroy();
              resolve("Docker daemon is ready.");
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
