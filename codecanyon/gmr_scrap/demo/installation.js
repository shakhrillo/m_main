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

const { Server } = require("socket.io");

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
dotenv.config({ path: path.join(__dirname, ".env.dev") });

const app = express();
app.use(connectLivereload());
const server = createServer(app);
const io = new Server(server);

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

app.post("/docker-build", async (req, res) => {
  try {
    await compose.buildAll({
      env: process.env,
      callback: (chunk) => {
        io.emit("docker-build", chunk.toString());
      },
    });
    res.send({
      message: "Docker Compose executed successfully",
      status: "success",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error executing Docker Compose");
  }
});

app.post("/containers-start", async (req, res) => {
  try {
    await compose.upAll({
      env: process.env,
      callback: (chunk) => {
        io.emit("containers-start", chunk.toString());
      },
    });
    let check = true;
    while (check) {
      io.emit("containers-start", "Waiting for 5 seconds... \n");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      try {
        const machineBuildImageName = process.env.MACHINE_BUILD_IMAGE_NAME;
        const image = docker.getImage(machineBuildImageName);
        const imageDetails = await image.inspect();
        io.emit("containers-start", "Checking if the image is ready... \n");
        if (imageDetails.RepoTags[0].includes(machineBuildImageName)) {
          io.emit("containers-start", "Image is ready! \n");
          check = false;
        }
      } catch (error) {
        io.emit(
          "containers-start",
          "Error checking the image: " + error + "\n"
        );
      }
    }
    res.send({
      message: "Containers started successfully",
      status: "success",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error starting containers");
  }
});

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

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
