const fs = require("fs");
const path = require("path");

const saveJSON = (req, res) => {
  try {
    const { json, name } = req.body;
    if (!json || !name) {
      return res.status(400).json({ error: "Missing 'json' object or 'name'" });
    }

    const sourcePath = path.resolve(__dirname, "../../");
    const filePath = path.join(sourcePath, name);

    if (json["projectId"]) {
      const envPath = path.join(sourcePath, ".env.firebase");
      const env = fs.readFileSync(envPath, "utf-8");

      if (env.indexOf("FIREBASE_PROJECT_ID") === -1) {
        const projectId = `FIREBASE_PROJECT_ID=${json["projectId"]}\n`;
        fs.writeFileSync(envPath, projectId + env, "utf-8");
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf-8");

    res.json({ message: "JSON file saved successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to save JSON file",
      details: error.message,
    });
  }
};

module.exports = saveJSON;
