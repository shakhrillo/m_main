const path = require("path");
const dotenv = require("dotenv");

const createNetworkEnv = () => {
  const network = Math.floor(Math.random() * 256);
  return {
    NETWORK_SUBNET: `172.18.${network}.0/24`,
    DOCKER_IPV4_ADDRESS: `172.18.${network}.2`,
    MACHINE_IPV4_ADDRESS: `172.18.${network}.3`,
    FIREBASE_IPV4_ADDRESS: `172.18.${network}.4`,
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
