const Docker = require("dockerode");
const { updateMachine } = require("./services/firebaseService");
const docker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "host.docker.internal",
  port: process.env.DOCKER_PORT || 2375,
});

/**
 * Watch Docker events and update Firebase with the machine data
 * @returns {Promise<void>}
 */
async function watchDockerEvents() {
  if (!docker) {
    console.error("Docker not initialized");
    return;
  }
  const eventsStream = await docker.getEvents();
  eventsStream.setEncoding("utf8");
  eventsStream.on("data", (data) => {
    if (!data || typeof data !== "string") return;
    const str = data.toString() || "";
    const lines = str.trim().split("\n");
    const parsedData = lines.map((line) => JSON.parse(line || "{}"));

    for (const data of parsedData) {
      const name = data?.Actor?.Attributes?.name;
      if (!name) return;

      updateMachine(name, data);
    }
  });
}

module.exports = {
  docker,
  watchDockerEvents,
};
