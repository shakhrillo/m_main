const path = require("path");
const dotenv = require("dotenv");

const generateRandomBaseIp = () => {
  const firstOctet = 192;
  const secondOctet = 168;
  const thirdOctet = Math.floor(Math.random() * 256);

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

const loadEnv = (type, filePath) => {
  const file = dotenv.config({ path: filePath });
  if (file.error) {
    throw file.error;
  }
  const result = file.parsed;

  switch (type) {
    case "main":
      if (
        !result.APP_ENVIRONMENT ||
        !result.APP_ID ||
        !result.APP_DOCKER_PORT ||
        !result.APP_CLIENT_PORT ||
        !result.APP_SERVER_PORT
      ) {
        throw new Error("Missing main environment variables");
      }
      break;
    case "stripe":
      if (
        !result.STRIPE_API_KEY ||
        !result.STRIPE_DEVICE_NAME ||
        !result.STRIPE_SUCCESS_URL ||
        !result.STRIPE_CANCEL_URL
      ) {
        throw new Error("Missing Stripe environment variables");
      }
      break;
    case "firebase":
      if (
        !result.FIREBASE_PROJECT_ID ||
        !result.FIREBASE_EMULATOR_AUTHENTICATION ||
        !result.FIREBASE_EMULATOR_UI ||
        !result.FIREBASE_EMULATOR_FUNCTIONS ||
        !result.FIREBASE_EMULATOR_FIRESTORE ||
        !result.FIREBASE_EMULATOR_STORAGE ||
        !result.FIREBASE_EMULATOR_HUB
      ) {
        throw new Error("Missing Firebase environment variables");
      }
      break;
    case "jwt":
      if (!result.JWT_SECRET) {
        throw new Error("Missing JWT environment variables");
      }
      break;
    case "maps":
      if (!result.GOOGLE_MAPS_API_KEY) {
        throw new Error("Missing Maps environment variables");
      }
      break;
  }

  return result;
};

const envPaths = {
  main: path.join(__dirname, "../../.env.main"),
  stripe: path.join(__dirname, "../../.env.stripe"),
  firebase: path.join(__dirname, "../../.env.firebase"),
  jwt: path.join(__dirname, "../../.env.jwt"),
  maps: path.join(__dirname, "../../.env.maps"),
};

const getEnv = () => {
  const env = {
    ...process.env,
    ...loadEnv("stripe", envPaths.stripe),
    ...loadEnv("firebase", envPaths.firebase),
    ...loadEnv("jwt", envPaths.jwt),
    ...loadEnv("maps", envPaths.maps),
    ...loadEnv("main", envPaths.main),
    ...createNetworkEnv(),
  };

  return env;
};

module.exports = {
  getEnv,
};
