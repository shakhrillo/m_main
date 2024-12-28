const Docker = require("dockerode");
const docker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "host.docker.internal",
  port: process.env.DOCKER_PORT || 2375,
});
module.exports = {
  docker,
};
