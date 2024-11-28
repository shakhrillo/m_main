const path = require("path");
const Docker = require("dockerode");

// const docker = new Docker({ socketPath: "/var/run/docker.sock" });

// const Docker = require("dockerode");
// const fs = require("fs");
// const path = require("path");

const docker = new Docker(); // Connects to Docker daemon

async function dockerBuildImage(tag, isInfo) {
  const dockerfilePath = isInfo ? "Dockerfile" : "Dockerfile";
  const buildContextPath = path.resolve("."); // Current directory as the build context

  // Create a tar stream of the build context
  const tarStream = await new Promise((resolve, reject) => {
    const tar = require("tar-fs");
    const stream = tar.pack(buildContextPath, {
      ignore: (name) => path.basename(name) === "node_modules", // Example: Ignore unnecessary files
    });
    resolve(stream);
  });

  // Options for the buildImage method
  const buildOptions = {
    t: tag, // Image tag
    // dockerfile: dockerfilePath, // Specify the Dockerfile to use
    platform: "linux/amd64", // Target platform
  };

  // Build the image
  docker.buildImage(tarStream, buildOptions, (err, output) => {
    if (err) {
      console.error("Error building image:", err);
      return;
    }

    // Listen to output from Docker
    output.pipe(process.stdout);
  });
}

// Example usage
// buildImage("my-image:latest", true);

module.exports = {
  docker,
  dockerBuildImage,
};
