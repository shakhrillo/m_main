const fs = require("fs");
const path = require("path");

const getScriptContent = (filename, folder) => {
  const scriptsDirectory = path.join(__dirname, "..", folder);
  return fs.readFileSync(path.join(scriptsDirectory, filename), "utf8");
};

module.exports = {
  getScriptContent,
};
