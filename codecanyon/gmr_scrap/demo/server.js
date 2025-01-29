const express = require("express");
const axios = require("axios");
const path = require("path");
const compose = require("docker-compose");
const os = require("os");
const { createServer } = require("node:http");
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
const server = createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "installation/public")));

// Routes to render HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "installation/views", "index.html"));
});

app.post("/docker-compose", async (req, res) => {
  try {
    await compose.buildAll({
      // cwd: path.join(__dirname, "installation"),
      env: process.env,
      callback: (chunk, streamSource) => {
        io.emit("docker-compose", chunk.toString());
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

app.post("/docker-start", async (req, res) => {
  try {
    await compose.upAll({
      // cwd: path.join(__dirname, "installation"),
      env: process.env,
      callback: (chunk, streamSource) => {
        io.emit("docker-compose", chunk.toString());
      },
    });
    res.send({
      message: "Docker Start executed successfully",
      status: "success",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error executing Docker Compose");
  }
});

app.post("/docker-check", async (req, res) => {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const machineBuildImageName = process.env.MACHINE_BUILD_IMAGE_NAME;

    if (!machineBuildImageName) {
      return res
        .status(400)
        .json({ status: "error", message: "Image name is missing" });
    }

    const image = docker.getImage(machineBuildImageName);
    const imageDetails = await image.inspect(); // Fetch image details

    res.json({
      imgName: machineBuildImageName,
      status: "success",
      imageDetails,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
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
