const Docker = require("dockerode");
const {
  updateMachine,
  addMachineStats,
} = require("./services/firebaseService");
const docker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "host.docker.internal",
  port: process.env.DOCKER_PORT || 2375,
});

/**
 * Check for Docker
 * @returns {Promise<boolean>}
 */
const checkDocker = async () => {
  while (true) {
    try {
      await docker.ping();
      console.log("Docker is ready");
      return true;
    } catch (error) {
      console.log("Waiting for Docker");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

/**
 * Watch Docker events and update Firebase with the machine data
 * @returns {Promise<void>}
 */
async function watchDockerEvents() {
  await checkDocker();

  const activeStreams = new Map();
  const eventsStream = await docker.getEvents();
  eventsStream.setEncoding("utf8");
  eventsStream.on("data", (data) => {
    if (!data || typeof data !== "string") return;
    const str = data.toString() || "";
    const lines = str.trim().split("\n");
    const parsedData = lines.map((line) => JSON.parse(line || "{}"));

    for (const data of parsedData) {
      const name = data?.Actor?.Attributes?.name;
      const status = data?.status;
      if (!name || name === "bridge") continue;

      updateMachine(name, data);

      if (status === "die") {
        console.log("Container died, removing from active streams");
        if (activeStreams.has(name)) {
          const stream = activeStreams.get(name);
          stream.destroy(); // Properly close the stream
          activeStreams.delete(name);
        }

        return;
      }

      // Clean up existing stream
      console.log("-".repeat(50));
      console.log("Name: ", name);
      console.log("-".repeat(50));
      if (activeStreams.has(name)) {
        const stream = activeStreams.get(name);
        stream.destroy(); // Properly close the stream
        activeStreams.delete(name);
      }

      const container = docker.getContainer(name);
      container.stats((err, stream) => {
        if (err) {
          console.error(err);
          return;
        }
        stream.setEncoding("utf8");
        stream.on("data", (data) => {
          try {
            const stats = JSON.parse(data);
            addMachineStats(name, stats);
          } catch (err) {
            console.error("Error parsing stats data:", err);
          }
        });

        stream.on("end", () => {
          console.log(`Stats stream ended for container ${name}`);
        });

        stream.on("error", (err) => {
          console.error(`Stats stream error for container ${name}:`, err);
        });

        activeStreams.set(name, stream); // Track the new stream
      });
    }
  });
}

module.exports = {
  docker,
  watchDockerEvents,
};
