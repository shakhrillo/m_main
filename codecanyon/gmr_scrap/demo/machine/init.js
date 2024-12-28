const Docker = require("dockerode");
const docker = new Docker({
  protocol: "http",
  host: "host.docker.internal",
  port: 2375,
});

(async () => {
  try {
    let containers = await docker.listContainers();
    while (!containers) {
      containers = await docker.listContainers();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Retrying to get containers");
    }
    console.log("Containers: ");
    console.log(containers);

    // Building the image with log stream
    const buildStream = await docker.buildImage(
      {
        context: __dirname,
        src: ["Dockerfile"],
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
      console.error("Build failed:", err);
    });
  } catch (err) {
    console.error(err);
  }
})();
