const Docker = require("dockerode");
const {
  updateMachine,
  updateDockerImageInfo,
} = require("./services/firebaseService");
const docker = new Docker();

docker.getImage("gmr_scrap_selenium:latest").inspect((err, data) => {
  if (err) {
    console.error("Error fetching image info:", err);
  } else {
    updateDockerImageInfo(data);
  }
});

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
          updateMachine(name, {
            status,
            docker: data,
          });

          if (status !== "destroy") {
            const container = docker.getContainer(name);

            if (status === "die") {
              // if (container) {
              //   container.remove();
              //   updateMachine(name, { stats: null });
              // }
              const stream = activeStreams.get(name);
              if (stream) {
                stream.destroy();
                activeStreams.delete(name);
              }
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
