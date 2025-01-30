const express = require("express");
const axios = require("axios");
const path = require("path");
const compose = require("docker-compose");
const os = require("os");
const { createServer } = require("node:http");

const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "installation/views"));

const Docker = require("dockerode");
let dockerSocketPath = "/var/run/docker.sock";
if (os.platform() === "win32") {
  dockerSocketPath = "tcp://localhost:2375";
}
const docker = new Docker({
  protocol: "http",
  host: process.env.DOCKER_HOST || "localhost",
  port: process.env.DOCKER_PORT || 2375,
});

const dotenv = require("dotenv");
const dockerBuild = require("./installation/services/dockerBuild");
const { initializeSocket } = require("./installation/utils/socket");
const containersStart = require("./installation/services/containersStart");
dotenv.config({ path: path.join(__dirname, ".env.dev") });

const app = express();
app.use(connectLivereload());

const server = createServer(app);
global.io = initializeSocket(server);

const PORT = 3000;

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "installation/public")));

// Routes to render HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "installation/views", "index.html"));
});

app.post("/docker-build", dockerBuild);

app.post("/containers-start", containersStart);

app.post("/firebase", async (req, res) => {
  try {
    const response = await axios.get("http://0.0.0.0:4400/emulators");
    const data = response.data;

    if (typeof data === "object" && data.auth) {
      res.send({
        message: "Firebase emulators are running",
        status: "success",
      });
    } else {
      // throw an error if the response is not as expected
      throw new Error("Unexpected response from Firebase emulators");
    }
  } catch (error) {
    res.status(500).send({
      message: "Error checking Firebase emulators",
      error: error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
