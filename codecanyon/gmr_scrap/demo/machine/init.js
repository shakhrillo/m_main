/**
 * @fileoverview This script automates the process of building a Docker image for the machine. It uses Dockerode to interact with the Docker API.
 * It retries the build process until it succeeds or the maximum number of retries is reached.
 *
 * Key Features:
 * - Initializes the Docker image build process.
 * - Retries the build process until it succeeds or the maximum number of retries is reached.
 *
 * Environment Variables:
 * - `DOCKER_HOST`: Specifies the Docker host. Defaults to `host.docker.internal`.
 * - `DOCKER_PORT`: Specifies the Docker port. Defaults to `2375`.
 * - `MACHINE_BUILD_IMAGE_NAME`: Specifies the name of the Docker image to build.
 *
 * Dependencies:
 * - `dockerode` - For interacting with the Docker API.
 *
 * Usage:
 * - Run the script using Node.js:
 *  ```bash
 * node init.js
 * ```
 *
 * Version History:
 * - 1.0.0: Initial release with Docker image build automation.
 *
 * Author:
 * - Shakhrillo
 *
 * License:
 * - This script is licensed under the CodeCanyon Standard License.
 *  See [CodeCanyon Licenses](https://codecanyon.net/licenses/standard) for more details.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author Shakhrillo
 * @license CodeCanyon Standard License
 */

"use strict";

// Load environment variables from the .env file
require("dotenv").config();

// Import dependencies
const Docker = require("dockerode");
const docker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "host.docker.internal",
  port: process.env.DOCKER_PORT || 2375,
});

/**
 * Checks if Docker is available.
 * @returns {Promise} The result of the check.
 */
async function checkDockerAvailable() {
  while (true) {
    try {
      await docker.ping();
      console.log("Docker is available.");
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Waiting for Docker to become available...");
    }
  }
}

/**
 * Initializes the Docker image build process.
 * @returns {Promise} The result of the build process.
 * @throws {Error} If the build process fails.
 */
(async () => {
  try {
    await checkDockerAvailable();

    const buildStream = await docker.buildImage(
      {
        context: process.cwd(),
        src: ["."],
      },
      { t: process.env.MACHINE_BUILD_IMAGE_NAME }
    );

    buildStream.on("data", (chunk) => {
      console.log(chunk.toString());
    });

    buildStream.on("end", () => {
      console.log("Image build complete.");
    });

    buildStream.on("error", (err) => {
      console.error("Build failed:", err.message);
      console.error("Stack trace:", err.stack);
    });
  } catch (err) {
    console.error("Docker initialization failed:", err.message);
    console.error("Stack trace:", err.stack);
  }
})();
