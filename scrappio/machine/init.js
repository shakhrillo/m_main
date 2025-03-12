/**
 * @fileoverview This script automates the process of building a Docker image for the machine. It uses Dockerode to interact with the Docker API.
 * It retries the build process until it succeeds or the maximum number of retries is reached.
 *
 * Key Features:
 * - Initializes the Docker image build process.
 * - Retries the build process until it succeeds or the maximum number of retries is reached.
 *
 * Environment Variables:
 * - `DOCKER_IPV4_ADDRESS`: Specifies the Docker host. Defaults to `host.docker.internal`.
 * - `APP_DOCKER_PORT`: Specifies the Docker port. Defaults to `2376`.
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
const fs = require("fs");
require("dotenv").config();

// Import dependencies
const Docker = require("dockerode");
const docker = new Docker(process.env.IN_DOCKER && {
  protocol: "https",
  host: process.env.DOCKER_IPV4_ADDRESS,
  port: process.env.APP_DOCKER_PORT,
  ca: fs.readFileSync("/certs/client/ca.pem"),
  cert: fs.readFileSync("/certs/client/cert.pem"),
  key: fs.readFileSync("/certs/client/key.pem"),
});

/**
 * Initializes the Docker image build process.
 * @returns {Promise} The result of the build process.
 * @throws {Error} If the build process fails.
 */
(async () => {
  try {
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
      console.error("Image build failed:", err.message);
    });
  } catch (err) {
    console.error("An error occurred:", err.message);
  }
})();
