const Kefir = require("kefir");
const Docker = require("dockerode");
const {
  updateMachine,
  addMachineStats,
} = require("./services/firebaseService");
const fs = require("fs");

let docker;

console.log("Docker host:", process.env.DOCKER_HOST);
console.log("Docker port:", process.env.DOCKER_PORT);

/**
 * Check for Docker
 * @returns {Promise<boolean>}
 */
const checkDocker = async () => {
  while (true) {
    try {
      console.log(
        "Docker host:",
        process.env.DOCKER_HOST || "host.docker.internal"
      );
      console.log("Docker port:", process.env.DOCKER_PORT || 2376);

      docker = new Docker({
        protocol: "https",
        host: process.env.DOCKER_HOST || "host.docker.internal",
        port: process.env.DOCKER_PORT || 2376,
        ca: fs.readFileSync("/certs/client/ca.pem"),
        cert: fs.readFileSync("/certs/client/cert.pem"),
        key: fs.readFileSync("/certs/client/key.pem"),
      });
      await docker.ping();
      console.log("Docker is ready");
      return true;
    } catch (error) {
      console.error("Error connecting to Docker:", error);
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

  const eventStream$ = Kefir.fromEvents(eventsStream, "data")
    .map((data) => {
      if (!data || typeof data !== "string") return null;
      return data
        .trim()
        .split("\n")
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch (err) {
            console.error("JSON parse error:", err);
            return null;
          }
        });
    })
    .flatten()
    .filter((data) => data !== null)
    .debounce(400);

  eventStream$.onValue((data) => {
    const name = data?.Actor?.Attributes?.name;
    const action = data?.Action;
    const status = data?.status;
    const isContainer = data?.Type === "container";
    const isNetwork = data?.Type === "network";
    const isImage = data?.Type === "image";

    if (!name) {
      console.error("No name found in data:", data);
      return;
    }

    updateMachine(name, data);

    if (isImage && action !== "pull") {
      docker.getImage(name).inspect().catch(console.error);
    }

    if (isNetwork) {
      docker.getNetwork(name).inspect().catch(console.error);
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

      docker
        .getContainer(name)
        .inspect()
        .then((containerData) => {
          if (!containerData.State.Running) {
            console.error(`Container ${name} is not running.`);
            return;
          }
          return docker.getContainer(name).stats();
        })
        .then((stream) => {
          if (!stream) return;
          const stream$ = Kefir.fromEvents(stream, "data")
            .debounce(400)
            .map((data) => {
              try {
                return JSON.parse(data);
              } catch (err) {
                console.error("Error parsing stats data:", err);
                return null;
              }
            })
            .filter((stats) => stats !== null);

          stream$.onValue((stats) => addMachineStats(name, stats));

          stream.on("end", () => {
            console.log(`Stats stream ended for container ${name}`);
          });

          stream.on("error", (err) => {
            console.error(`Stats stream error for container ${name}:`, err);
          });

          activeStreams.set(name, stream);
        })
        .catch(console.error);
    }
  });
}

module.exports = {
  docker,
  watchDockerEvents,
};
