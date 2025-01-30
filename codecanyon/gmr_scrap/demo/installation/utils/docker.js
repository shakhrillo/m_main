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

const checkDocker = async () => {
  while (true) {
    try {
      await dinDocker.ping();
      global.io.emit("docker-build", "Docker is ready \n");
      return true;
    } catch (error) {
      global.io.emit("docker-build", "Waiting for Docker \n");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

module.exports = {
  dinDocker,
  localDocker,
  checkDocker,
};
