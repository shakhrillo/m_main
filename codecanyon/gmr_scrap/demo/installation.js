const express = require("express");
const axios = require("axios");
const path = require("path");
const compose = require("docker-compose");
const fs = require("fs");

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
app.use(express.json());
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

app.get("/load-env", (req, res) => {
  const envFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file.startsWith(".env."));
  const envs = envFiles.map((file) => {
    const name = file.replace(".env.", "");
    const content = fs.readFileSync(path.join(__dirname, file), "utf-8");
    const env = content.split("\n").reduce((acc, line) => {
      const [key, value] = line.split("=");
      acc[key] = value;
      return acc;
    }, {});
    return { name, env };
  });
  res.send(envs);
});

app.post("/save-env", (req, res) => {
  const { env, name } = req.body;
  const envContent = Object.keys(env)
    .map((key) => `${key}=${env[key]}`)
    .join("\n");
  fs.writeFileSync(path.join(__dirname, `.env.${name}`), envContent);
  res.send("OK");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
