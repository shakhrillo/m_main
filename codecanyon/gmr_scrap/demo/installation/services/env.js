const path = require("path");
const dotenv = require("dotenv");

const generateRandomBaseIp = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(
    Math.random() * 256
  )}.${Math.floor(Math.random() * 256)}`;
};

const createNetworkEnv = () => {
  const subnetBase = generateRandomBaseIp();
  const subnet = `${subnetBase}.0/24`;
  console.log("Network subnet:", subnet);

  return {
    NETWORK_SUBNET: subnet,
    DOCKER_IPV4_ADDRESS: `${subnetBase}.2`,
    MACHINE_IPV4_ADDRESS: `${subnetBase}.3`,
    FIREBASE_IPV4_ADDRESS: `${subnetBase}.4`,
    SERVER_IPV4_ADDRESS: `${subnetBase}.5`,
    CLIENT_IPV4_ADDRESS: `${subnetBase}.6`,
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
  main: path.join(__dirname, "../../.env.main"),
};

const env = {
  ...process.env,
  ...loadEnv(envPaths.default),
  ...loadEnv(envPaths.stripe),
  ...loadEnv(envPaths.firebase),
  ...loadEnv(envPaths.main),
  ...createNetworkEnv(),
};

module.exports = env;
