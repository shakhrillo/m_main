const Kefir = require("kefir");
const Docker = require("dockerode");
const fs = require("fs");
const {
  updateMachine,
  addMachineStats,
  addMachineLogs,
  updateMachineHistory,
  addDefaultSettings,
} = require("./services/firebaseService");
const { db } = require("./firebase");

/**
 * Docker instance
 * @type {Docker}
 */
let docker;

const activeStreams = new Map();

const initializeDocker = () => {
  console.log("process.env.IS_TEST", process.env.IS_TEST);
  if (process.env.IS_TEST) {
    docker = new Docker();
  } else {
    docker = new Docker({
      protocol: "https",
      host: process.env.DOCKER_IPV4_ADDRESS || "host.docker.internal",
      port: process.env.APP_DOCKER_PORT || 2376,
      ca: fs.readFileSync("/certs/client/ca.pem"),
      cert: fs.readFileSync("/certs/client/cert.pem"),
      key: fs.readFileSync("/certs/client/key.pem"),
    });
  }
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

/**
 * Get image history
 * @param {string} imageName
 * @returns {Promise<import("dockerode").ImageInspectInfo>}
 */
const getImageHistory = async (imageName) => {
  if (!imageName) return console.warn("Image name is required."), null;
  try {
    return await docker.getImage(imageName).history();
  } catch (error) {
    console.error("Error fetching image history:", error);
    return null;
  }
};

const checkDocker = async () => {
  while (true) {
    try {
      if (!fs.existsSync("/certs/client") && !process.env.IS_TEST)
        throw new Error("Waiting for /certs/client directory");
      initializeDocker();
      await docker.ping();
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

      const imgHistory = await getImageHistory(name);
      await updateMachineHistory(name, imgHistory);
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
      const machineId = machine.Actor.ID;
      const { status, action } = machine;
      if (!name) return console.error("No name found in event data");
      await updateMachine(name, machine);

      if (activeStreams.has(name)) {
        const stream = activeStreams.get(name);
        stream.destroy();
        activeStreams.delete(name);
      }

      if (activeStreams.has(machineId)) {
        const stream = activeStreams.get(machineId);
        stream.destroy();
        activeStreams.delete(machineId);
      }

      if (["destroy", "die"].includes(status) || action === "destroy") return;

      try {
        const container = docker.getContainer(name);
        if (!(await container.inspect()).State.Running) return;
        // Fetch stats
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

        // Fetch logs
        const logsStream = await container.logs({
          follow: true,
          stdout: true,
          stderr: true,
          timestamps: false,
        });
        const logs$ = Kefir.fromEvents(logsStream, "data")
          .debounce(400)
          .map((data) => data.toString())
          .filter(Boolean);
        logs$.onValue((log) => addMachineLogs(name, log));
        ["end", "error"].forEach((e) =>
          logsStream.on(e, () => activeStreams.delete(machineId))
        );
        activeStreams.set(machineId, logsStream);
      } catch (error) {
        console.error(
          `Error fetching stats for container ${machineId}:`,
          error.message
        );
      }
    });
};

async function initDefaultSettings() {
  [
    {
      tag: "logo",
      label: "Logo",
      helpText: "The URL for the logo.",
      type: "general",
      value: "http://localhost:3000/src/assets/logo.svg",
    },
    {
      tag: "favicon",
      label: "Favicon",
      helpText: "The URL for the favicon.",
      type: "general",
      value: "http://localhost:3000/src/assets/favicon.ico",
    },
    {
      tag: "title",
      label: "Title",
      helpText: "The title of the website.",
      type: "general",
      value: "GMR Scrap",
    },
    {
      tag: "description",
      label: "Description",
      helpText: "The description of the website.",
      type: "general",
      value:
        "GMR Scrap is a web scraping tool that allows you to scrape websites and extract data from them.",
    },
    {
      tag: "keywords",
      label: "Keywords",
      helpText: "The keywords of the website.",
      type: "general",
      value: "web scraping, data extraction, scraping tool",
    },
    {
      tag: "cost",
      label: "Cost",
      helpText: "The cost of the service.",
      type: "coin",
      value: "0.01",
    },
    {
      tag: "image",
      label: "Image",
      helpText: "The cost of each image extraction.",
      type: "coin",
      value: "3",
    },
    {
      tag: "video",
      label: "Video",
      helpText: "The cost of each video extraction.",
      type: "coin",
      value: "5",
    },
    {
      tag: "response",
      label: "Response",
      helpText: "The cost of each response extraction.",
      type: "coin",
      value: "2",
    },
    {
      tag: "review",
      label: "Review",
      helpText: "The cost of each review extraction.",
      type: "coin",
      value: "4",
    },
    {
      tag: "validation",
      label: "Validation",
      helpText: "The cost of each validation extraction.",
      type: "coin",
      value: "1",
    },
    {
      tag: "minimum",
      label: "Minimum",
      helpText: "Minimum number of retries.",
      type: "scrap",
      value: "5",
    },
    {
      tag: "maximum",
      label: "Maximum",
      helpText: "Maximum number of retries.",
      type: "scrap",
      value: "10",
    },
    {
      tag: "retries",
      label: "Retries",
      helpText: "Number of retries.",
      type: "scrap",
      value: "3",
    },
  ].forEach(async (setting) => {
    try {
      await addDefaultSettings(setting);
    } catch (error) {
      console.error("Error initializing default settings:", error);
    }
  });
}

const watchDockerEvents = async () => {
  if (await checkDocker()) {
    await initDefaultSettings();
    await handleImageEvents();
    await handleContainerEvents();
  }
};

module.exports = { getDocker: initializeDocker, docker, watchDockerEvents };
