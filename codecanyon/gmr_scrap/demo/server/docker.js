const Docker = require("dockerode");
const {
  updateMachine,
  updateDockerInfo,
} = require("./services/firebaseService");
const docker = new Docker();

async function watchEvents() {
  const activeStreams = new Map();
  const eventsStream = await docker.getEvents();

  eventsStream.setEncoding("utf8");
  eventsStream.on("data", (data) => {
    const str = data.toString();
    const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
    const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";

    if (new RegExp(`${overviewPrefix}_|${reviewsPrefix}_`).test(str)) {
      console.log("Docker event:", str);

      try {
        const lines = str.trim().split("\n");
        const parsedData = lines.map((line) => JSON.parse(line));
        for (const data of parsedData) {
          let status = data.status;
          const name = data.Actor.Attributes.name;
          updateMachine(name, data);

          if (status !== "destroy") {
            const container = docker.getContainer(name);

            if (status === "die") {
              container.remove();
              return;
            }

            if (!activeStreams.has(name)) {
              container.stats((err, stream) => {
                if (err) {
                  console.error(err);
                  return;
                }
                stream.setEncoding("utf8");
                stream.on("data", (data) => {
                  const stats = JSON.parse(data);
                  updateMachine(name, { stats });
                });
                activeStreams.set(name, stream);
              });
            }
          } else {
            const stream = activeStreams.get(name);
            if (stream) {
              stream.destroy();
              activeStreams.delete(name);
              console.log("Stream destroyed for", name);
            }

            docker.info(async (err, info) => {
              if (err) {
                console.error("Error fetching Docker info:", err);
              } else {
                try {
                  updateDockerInfo(info);
                } catch (error) {
                  console.error("Error saving Docker info:", error);
                }
              }
            });
          }
        }
      } catch (error) {
        console.log("Error saving machine data:", error);
      }
    }
  });
}

module.exports = {
  docker,
  watchEvents,
};
