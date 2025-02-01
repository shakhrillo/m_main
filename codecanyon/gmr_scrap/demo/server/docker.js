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
// const checkDocker = async () => {
//   while (true) {
//     try {
//       await docker.ping();
//       console.log("Docker is ready");
//       return true;
//     } catch (error) {
//       console.log("Waiting for Docker");
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//     }
//   }
// };

/**
 * Watch Docker events and update Firebase with the machine data
 * @returns {Promise<void>}
 */
async function watchDockerEvents() {
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
      const isNetwork = data?.Type === "network";
      const isImage = data?.Type === "image";

      const action = data?.Action;
      const status = data?.status;

      updateMachine(name, data);

      if (isImage && action !== "pull") {
        docker.getImage(name).inspect((err, data) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }

      if (isNetwork) {
        docker.getNetwork(name).inspect((err, data) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }

      if (isContainer) {
        if (activeStreams.has(name)) {
          const stream = activeStreams.get(name);
          stream.destroy();
          activeStreams.delete(name);
        }

        if (action === "destroy" || status === "destroy" || status === "die") {
          console.log("Container destroyed, removing from active streams");
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
    }
  });
}

module.exports = {
  docker,
  watchDockerEvents,
};
