const path = require("path");
const dotenv = require("dotenv");

// Helper function to load environment variables from a specific file
const loadEnv = (filePath) => {
  const result = dotenv.config({ path: filePath });
  return result.error ? {} : result.parsed || {};
};

const envPaths = {
  default: path.join(__dirname, "../../.env.dev"),
  stripe: path.join(__dirname, "../../.env.stripe"),
  firebase: path.join(__dirname, "../../.env.firebase"),
};

const env = {
  ...process.env,
  ...loadEnv(envPaths.default),
  ...loadEnv(envPaths.stripe),
  ...loadEnv(envPaths.firebase),
};

module.exports = env;
