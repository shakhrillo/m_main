console.log("Init script running");

const Docker = require("dockerode");
const docker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "host.docker.internal",
  port: process.env.DOCKER_PORT || 2375,
});

async function retryDockerAction(action, retries = 15, delay = 2000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await action(); // Try the Docker action
    } catch (err) {
      attempt++;
      console.error(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt >= retries) {
        throw new Error("Maximum retries reached");
      }
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
}

(async () => {
  console.log("Starting the init script");
  try {
    let containers = await retryDockerAction(() => docker.listContainers());
    console.log("Containers: ");
    console.log(containers);

    // Building the image with log stream
    const buildStream = await docker.buildImage(
      {
        context: process.cwd(),
        src: ["."],
      },
      { t: "gmr_scrap_machine" }
    );

    // Listening to the stream and outputting logs
    buildStream.on("data", (chunk) => {
      console.log(chunk.toString());
    });

    // Wait until the build is finished
    buildStream.on("end", () => {
      console.log("Image build complete.");
    });

    buildStream.on("error", (err) => {
      console.error("Build failed:", err.message);
      console.error("Stack trace:", err.stack);
    });
  } catch (err) {
    console.error("Failed during init:", err);
  }
})();
