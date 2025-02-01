const path = require("path");
const dotenv = require("dotenv");

const createNetworkEnv = () => {
  return {
    NETWORK_SUBNET: `9.9.0.0/24`,
    DOCKER_IPV4_ADDRESS: `9.9.0.2`,
    MACHINE_IPV4_ADDRESS: `9.9.0.3`,
    FIREBASE_IPV4_ADDRESS: `9.9.0.4`,
    SERVER_IPV4_ADDRESS: `9.9.0.5`,
    CLIENT_IPV4_ADDRESS: `9.9.0.6`,
  };
};

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
  ...createNetworkEnv(),
};

module.exports = env;
