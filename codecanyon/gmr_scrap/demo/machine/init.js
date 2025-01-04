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
 * Retries an action until it succeeds or the maximum number of retries is reached.
 * @param {Function} action The action to retry.
 * @param {number} retries The maximum number of retries.
 * @param {number} delay The delay between retries in milliseconds.
 * @returns {Promise} The result of the action.
 * @throws {Error} If the maximum number of retries is reached.
 */
async function retryDockerAction(action, retries = 15, delay = 2000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await action();
    } catch (err) {
      attempt++;
      if (attempt >= retries) {
        throw new Error("Maximum retries reached");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    } finally {
      console.log(`Attempt ${attempt} of ${retries}`);
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
    await retryDockerAction(() => docker.listContainers());

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
