const Docker = require("dockerode");
const docker = new Docker();

async function watchEvents() {
  const activeStreams = new Map();
  const eventsStream = await docker.getEvents();

  eventsStream.setEncoding("utf8");
  eventsStream.on("data", (data) => {
    const str = data.toString();
    let status = str.match(/"status":"([^"]+)"/);
    status = status ? status[1] : "";

    const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
    const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";

    if (new RegExp(`${overviewPrefix}_|${reviewsPrefix}_`).test(str)) {
      console.log("Docker event:", str);

      try {
        const lines = str.trim().split("\n");
        const parsedData = lines.map((line) => JSON.parse(line));
        for (const data of parsedData) {
          const name = data.Actor.Attributes.name;
          db.collection("machines").doc(name).set(data, { merge: true });

          if (status !== "destroy") {
            const container = docker.getContainer(name);
            if (status === "die") {
              container.remove();
              if (activeStreams.has(name)) {
                const stream = activeStreams.get(name);
                stream.removeAllListeners(); // Unsubscribe from the stream
                activeStreams.delete(name); // Remove from active streams
                console.log(`Unsubscribed from container: ${name}`);
              }
            }

            if (container) {
              container.stats((err, stream) => {
                if (err) {
                  console.error(err);
                  return;
                }
                stream.setEncoding("utf8");
                stream.on("data", (data) => {
                  const stats = JSON.parse(data);
                  // console.log("Stats:", stats);

                  db.collection("machines")
                    .doc(name)
                    .set({ stats }, { merge: true });
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
                await db
                  .collection("docker")
                  .doc("info")
                  .set({ info: JSON.stringify(info) }, { merge: true });
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
  watchEvents,
};
