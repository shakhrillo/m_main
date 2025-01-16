const Docker = require("dockerode");
const {
  updateMachine,
  updateDockerInfo,
} = require("./services/firebaseService");
const docker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "host.docker.internal",
  port: process.env.DOCKER_PORT || 2375,
});

async function watchDockerEvents() {
  const activeStreams = new Map();
  const eventsStream = await docker.getEvents();

  eventsStream.setEncoding("utf8");
  eventsStream.on("data", (data) => {
    const str = data.toString();
    let status = str.match(/"status":"([^"]+)"/);
    status = status ? status[1] : "";

    const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
    const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";
    const isInfo = new RegExp(`${overviewPrefix}_`).test(str);
    const isComments = new RegExp(`${reviewsPrefix}_`).test(str);
    const type = isInfo ? "info" : isComments ? "comments" : "";

    if (type) {
      console.log("Docker event:", str);

      try {
        const lines = str.trim().split("\n");
        const parsedData = lines.map((line) => JSON.parse(line));
        for (const data of parsedData) {
          const name = data.Actor.Attributes.name;
          updateMachine(name, { ...data, type });

          if (status !== "destroy") {
            if (activeStreams.has(name)) {
              console.log("---".repeat(100));
              console.log(`Container: ${name} is already being watched`);
              console.log("---".repeat(100));
              const stream = activeStreams.get(name);
              stream.removeAllListeners(); // Unsubscribe from the stream
              activeStreams.delete(name); // Remove from active streams
              console.log(`Unsubscribed from container: ${name}`);
            }

            const container = docker.getContainer(name);
            if (status === "die") {
              container.remove();
            } else if (container) {
              container.stats((err, stream) => {
                if (err) {
                  console.error(err);
                  return;
                }
                stream.setEncoding("utf8");
                stream.on("data", (data) => {
                  const stats = JSON.parse(data);
                  // console.log("Stats:", stats);
                  updateMachine(name, { stats });
                });

                activeStreams.set(name, stream); // Keep track of the stream
              });
            }
          }
        }

        if (status === "destroy") {
          docker.info(async (err, info) => {
            if (err) {
              console.error("Error fetching Docker info:", err);
            } else {
              console.log("Docker Engine Info:");
              try {
                updateDockerInfo(info);
              } catch (error) {
                console.error("Error saving Docker info:", error);
              }
            }
          });
        }
      } catch (error) {
        console.log("Error saving machine data:", error);
      }
    }
  });
}

module.exports = {
  docker,
  watchDockerEvents,
};
