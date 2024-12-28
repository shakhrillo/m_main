const Docker = require("dockerode");
const docker = new Docker({
  protocol: "http",
  host: "host.docker.internal",
  port: 2375,
});
docker.listContainers(function (err, containers) {
  console.log("All containers: ");
  console.log(containers);
});
module.exports = {
  docker,
};
