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

module.exports = {
  dinDocker,
  localDocker,
};
