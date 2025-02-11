const Kefir = require("kefir");
const Docker = require("dockerode");
const {
  updateMachine,
  addMachineStats,
} = require("./services/firebaseService");
const fs = require("fs");

const getDocker = () => {
  return new Docker({
    protocol: "https",
    host: process.env.DOCKER_IPV4_ADDRESS || "host.docker.internal",
    port: process.env.APP_DOCKER_PORT || 2376,
    ca: fs.readFileSync("/certs/client/ca.pem"),
    cert: fs.readFileSync("/certs/client/cert.pem"),
    key: fs.readFileSync("/certs/client/key.pem"),
  });
};

/**
 * Docker instance
 * @type {Docker}
 */
let docker;

const getImageDetails = async (imageName) => {
  try {
    if (!imageName) {
      console.warn("Image name is required.");
      return null;
    }

    const image = docker.getImage(imageName);
    const imageDetails = await image.inspect();
    return imageDetails;
  } catch (error) {
    if (error.statusCode === 404) {
      console.warn(`Image '${imageName}' not found.`);
      return null;
    }

    console.error("Unexpected error fetching image details:", error);
    return null;
  }
};

/**
 * Check for Docker
 * @returns {Promise<boolean>}
 */
const checkDocker = async () => {
  while (true) {
    try {
      try {
        fs.readdirSync("/certs/client");
      } catch (error) {
        console.log("Waiting for /certs/client directory to be mounted");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue;
      }

      docker = new Docker({
        protocol: "https",
        host: process.env.DOCKER_IPV4_ADDRESS || "host.docker.internal",
        port: process.env.APP_DOCKER_PORT || 2376,
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
 * Watch Docker events and update Firebase with machine data
 */
async function watchDockerEvents() {
  const isDockerReady = await checkDocker();
  if (!isDockerReady) return;

  const activeStreams = new Map();

  try {
    const eventsImageStream = await docker.getEvents({
      filters: {
        type: ["image"],
      },
    });
    eventsImageStream.setEncoding("utf8");

    const imageStream$ = Kefir.fromEvents(eventsImageStream, "data")
      .map((data) => {
        const parsedData = JSON.parse(data);
        return parsedData;
      })
      .debounce(1000);

    imageStream$.onValue(async (data) => {
      console.log("data", data);
      const image = data?.Actor?.Attributes?.name;

      if (!image) {
        console.error("No image found in event data:", data);
        return;
      }

      try {
        const imageDetails = await getImageDetails(image);
        console.log("imageDetails", imageDetails);
        if (!imageDetails) return;

        await updateMachine(image, imageDetails);
      } catch (error) {
        console.log(error);
      }
    });

    //

    const eventsStream = await docker.getEvents({
      filters: {
        image: ["gmrs-dev"],
        type: ["container"],
      },
    });
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
      .filter(Boolean)
      .debounce(1000);

    eventStream$.onValue(async (data) => {
      const name = data?.Actor?.Attributes?.name;
      const action = data?.Action;
      const status = data?.status;

      if (!name) {
        console.error("No name found in event data:", data);
        return;
      }

      await updateMachine(name, data);

      if (activeStreams.has(name)) {
        const stream = activeStreams.get(name);
        stream.destroy();
        activeStreams.delete(name);
      }

      if (action === "destroy" || status === "destroy" || status === "die") {
        console.log(
          `Container ${name} destroyed, removing from active streams`
        );
        return;
      }

      try {
        const container = docker.getContainer(name);
        const containerData = await container.inspect();

        if (!containerData?.State?.Running) {
          console.warn(`Container ${name} is not running.`);
          return;
        }

        const stream = await container.stats();
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
          .filter(Boolean);

        stream$.onValue(async (stats) => await addMachineStats(name, stats));

        stream.on("end", () => {
          console.log(`Stats stream ended for container ${name}`);
          activeStreams.delete(name);
        });

        stream.on("error", (err) => {
          console.error(`Stats stream error for container ${name}:`, err);
          activeStreams.delete(name);
        });

        activeStreams.set(name, stream);
      } catch (error) {
        console.error(
          `Error fetching stats for container ${name}:`,
          error.message
        );
      }
    });
  } catch (error) {
    console.error("Error watching Docker events:", error.message);
  }
}

module.exports = {
  getDocker,
  docker,
  watchDockerEvents,
};
