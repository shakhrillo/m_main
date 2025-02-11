const Kefir = require("kefir");
const Docker = require("dockerode");
const fs = require("fs");
const {
  updateMachine,
  addMachineStats,
} = require("./services/firebaseService");

const DOCKER_CONFIG = {
  protocol: "https",
  host: process.env.DOCKER_IPV4_ADDRESS || "host.docker.internal",
  port: process.env.APP_DOCKER_PORT || 2376,
  ca: fs.readFileSync("/certs/client/ca.pem"),
  cert: fs.readFileSync("/certs/client/cert.pem"),
  key: fs.readFileSync("/certs/client/key.pem"),
};

let docker;
const activeStreams = new Map();

const initializeDocker = () => {
  docker = new Docker(DOCKER_CONFIG);
  return docker;
};

const getImageDetails = async (imageName) => {
  if (!imageName) return console.warn("Image name is required."), null;
  try {
    return await docker.getImage(imageName).inspect();
  } catch (error) {
    if (error.statusCode === 404)
      console.warn(`Image '${imageName}' not found.`);
    else console.error("Error fetching image details:", error);
    return null;
  }
};

const checkDocker = async () => {
  while (true) {
    try {
      if (!fs.existsSync("/certs/client"))
        throw new Error("Waiting for /certs/client directory");
      initializeDocker();
      await docker.ping();
      console.log("Docker is ready");
      return true;
    } catch (error) {
      console.error("Error connecting to Docker:", error.message);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

const handleImageEvents = async () => {
  const stream = await docker.getEvents({ filters: { type: ["image"] } });
  Kefir.fromEvents(stream.setEncoding("utf8"), "data")
    .map(JSON.parse)
    .debounce(1000)
    .onValue(async ({ Actor: { Attributes: { name } = {} } = {} }) => {
      if (!name) return console.error("No image found in event data");
      const details = await getImageDetails(name);
      if (details)
        await updateMachine(name, {
          ...details,
          Type: "image",
        });
    });
};

const handleContainerEvents = async () => {
  const stream = await docker.getEvents({
    filters: { image: ["gmrs-dev"], type: ["container"] },
  });
  Kefir.fromEvents(stream.setEncoding("utf8"), "data")
    .map((data) =>
      data
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line))
        .filter(Boolean)
    )
    .flatten()
    .debounce(1000)
    .onValue(async (machine) => {
      const name = machine.Actor.Attributes.name;
      const { status, action } = machine;
      if (!name) return console.error("No name found in event data");
      await updateMachine(name, machine);

      if (activeStreams.has(name)) {
        const stream = activeStreams.get(name);
        stream.destroy();
        activeStreams.delete(name);
      }

      if (["destroy", "die"].includes(status) || action === "destroy") return;

      try {
        const container = docker.getContainer(name);
        if (!(await container.inspect()).State.Running) return;
        const statsStream = await container.stats();
        const stats$ = Kefir.fromEvents(statsStream, "data")
          .debounce(400)
          .map(JSON.parse)
          .filter(Boolean);
        stats$.onValue((stats) => addMachineStats(name, stats));
        ["end", "error"].forEach((e) =>
          statsStream.on(e, () => activeStreams.delete(name))
        );
        activeStreams.set(name, statsStream);
      } catch (error) {
        console.error(
          `Error fetching stats for container ${name}:`,
          error.message
        );
      }
    });
};

const watchDockerEvents = async () => {
  if (await checkDocker()) {
    await handleImageEvents();
    await handleContainerEvents();
  }
};

module.exports = { getDocker: initializeDocker, docker, watchDockerEvents };
