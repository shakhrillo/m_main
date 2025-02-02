const express = require("express");
const path = require("path");
const { createServer } = require("node:http");
const dockerBuild = require("./installation/services/dockerBuild");
const { initializeSocket } = require("./installation/utils/socket");
const loadEnv = require("./installation/services/loadEnv");
const saveEnv = require("./installation/services/saveEnv");

const app = express();
app.use(express.json());
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

const server = createServer(app);
global.io = initializeSocket(server);

const sourcePath = path.join(__dirname, "installation");
app.use(express.static(path.join(sourcePath, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(sourcePath, "views", "index.html"));
});

app.post("/docker-build", dockerBuild);
app.get("/load-env", loadEnv);
app.post("/save-env", saveEnv);

server.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
