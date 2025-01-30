const fs = require("fs");
const path = require("path");

const saveEnv = (req, res) => {
  try {
    const { env, name } = req.body;
    if (!env || !name) {
      return res.status(400).json({ error: "Missing 'env' object or 'name'" });
    }

    const sourcePath = path.resolve(__dirname, "../../");
    const filePath = path.join(sourcePath, `.env.${name}`);

    const envContent = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    fs.writeFileSync(filePath, envContent, "utf-8");

    res.json({ message: "Environment file saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to save environment file",
        details: error.message,
      });
  }
};

module.exports = saveEnv;
