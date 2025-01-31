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
      const isContainer = data?.Type === "container";
      const action = data?.Action;
      const status = data?.status;

      console.log("-".repeat(50));
      console.log({
        name,
        data: JSON.stringify(data, null, 2),
      });
      console.log("-".repeat(50));

      if (data?.Type === "image") {
        docker.getImage(name).inspect((err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          updateMachine(name, data);
        });
      }

      if (data?.Type === "network") {
        docker.getNetwork(name).inspect((err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          updateMachine(name, data);
        });
      }

      updateMachine(name, data);

      if (!name || name === "bridge" || !isContainer) continue;

      if (status === "die") {
        console.log("Container died, removing from active streams");
        if (activeStreams.has(name)) {
          const stream = activeStreams.get(name);
          stream.destroy(); // Properly close the stream
          activeStreams.delete(name);
        }

        return;
      }

      if (activeStreams.has(name)) {
        const stream = activeStreams.get(name);
        stream.destroy(); // Properly close the stream
        activeStreams.delete(name);
      }

      if (action === "destroy" || status === "destroy") {
        console.log(`Container ${name} was destroyed.`);
        return;
      }

      try {
        const container = docker.getContainer(name);
        container.inspect((err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          if (data.State.Running === false) {
            console.error(`Container ${name} is not running.`);
            return;
          }

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
        });
      } catch (err) {
        console.log("Error getting container stats:", err);
      }
    }
  });
}

module.exports = {
  docker,
  watchDockerEvents,
};
