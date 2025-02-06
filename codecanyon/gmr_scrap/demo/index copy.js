const express = require("express");
const path = require("path");
const { createServer } = require("node:http");
const dockerBuild = require("./installation/services/dockerBuild");
const { initializeSocket } = require("./installation/utils/socket");
const loadEnv = require("./installation/services/loadEnv");
const saveEnv = require("./installation/services/saveEnv");
const saveJSON = require("./installation/services/saveJSON");
const loadAssets = require("./installation/services/assets");

loadAssets();
const publicPath = path.join(__dirname, "installation", "public");

const app = express();
app.use(express.json());

const server = createServer(app);
global.io = initializeSocket(server);

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(express.static(publicPath));
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.post("/docker-build", dockerBuild);
app.get("/load-env", loadEnv);
app.post("/save-env", saveEnv);
app.post("/save-json", saveJSON);
app.post("/load-json", (req, res) => {
  const { name } = req.body;
  const filePath = path.join(__dirname, name);

  try {
    const json = require(filePath);
    res.json(json);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load JSON file",
      details: error.message,
    });
  }
});

server.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
