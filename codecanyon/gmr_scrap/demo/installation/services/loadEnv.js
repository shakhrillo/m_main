const fs = require("fs");
const path = require("path");

const loadEnv = (req, res) => {
  const sourcePath = path.resolve(__dirname, "../../");

  const envs = fs
    .readdirSync(sourcePath)
    .filter((file) => file.startsWith(".env."))
    .map((file) => ({
      name: file.replace(".env.", ""),
      env: Object.fromEntries(
        fs
          .readFileSync(path.join(sourcePath, file), "utf-8")
          .split("\n")
          .filter(Boolean)
          .map((line) => line.split("=").map((part) => part.trim()))
      ),
    }));

  res.json(envs);
};

module.exports = loadEnv;
