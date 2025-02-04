const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const generateRandomBaseIp = () => {
  const firstOctet = 192;
  const secondOctet = 168;
  const thirdOctet = Math.floor(Math.random() * 256); // 0-255

  return `${firstOctet}.${secondOctet}.${thirdOctet}`;
};

const createNetworkEnv = () => {
  const subnetBase = generateRandomBaseIp();
  const subnet = `${subnetBase}.0/24`;

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

  // if (filePath.includes(".env.main")) {
  //   console.log("Saving env to .env");
  //   console.log(result.parsed);
  //   saveEnv(path.join(__dirname, "../../.env"), result.parsed || {});
  // }

  return result.error ? {} : result.parsed || {};
};

// const saveEnv = (filePath, data) => {
//   console.log("Saving env to", filePath);
//   const envContent = Object.entries(data)
//     .map(([key, value]) => `${key}=${value}`)
//     .join("\n");
//   fs.writeFileSync(filePath, envContent, "utf-8");
// };

const envPaths = {
  main: path.join(__dirname, "../../.env.main"),
  stripe: path.join(__dirname, "../../.env.stripe"),
  firebase: path.join(__dirname, "../../.env.firebase"),
  jwt: path.join(__dirname, "../../.env.jwt"),
  maps: path.join(__dirname, "../../.env.maps"),
};

// const env = {
//   ...process.env,
//   ...loadEnv(envPaths.stripe),
//   ...loadEnv(envPaths.firebase),
//   ...loadEnv(envPaths.jwt),
//   ...loadEnv(envPaths.maps),
//   ...loadEnv(envPaths.main),
//   ...createNetworkEnv(),
// };

const getEnv = () => {
  return {
    ...process.env,
    ...loadEnv(envPaths.stripe),
    ...loadEnv(envPaths.firebase),
    ...loadEnv(envPaths.jwt),
    ...loadEnv(envPaths.maps),
    ...loadEnv(envPaths.main),
    ...createNetworkEnv(),
  };
};

module.exports = {
  getEnv,
};
