const fs = require("fs");

function createEnvironment(content = "", path = "./machines/.env") {
  fs.writeFileSync(path, content, "utf8");
}

module.exports = { createEnvironment };
