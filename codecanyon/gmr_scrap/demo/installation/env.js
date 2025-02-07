const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const sourcePath = path.resolve(__dirname, "../");

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

const loadEnv = () => {
  const envPath = path.join(sourcePath, ".env");
  const file = dotenv.config({ path: envPath });

  if (file.error) {
    throw new Error(
      `Failed to load .env file from ${envPath}: ${file.error.message}`
    );
  }

  const requiredVars = [
    "APP_ENVIRONMENT",
    "APP_ID",
    "APP_DOCKER_PORT",
    "APP_CLIENT_PORT",
    "APP_SERVER_PORT",
    "STRIPE_API_KEY",
    "STRIPE_DEVICE_NAME",
    "STRIPE_SUCCESS_URL",
    "STRIPE_CANCEL_URL",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_EMULATOR_AUTHENTICATION",
    "FIREBASE_EMULATOR_UI",
    "FIREBASE_EMULATOR_FUNCTIONS",
    "FIREBASE_EMULATOR_FIRESTORE",
    "FIREBASE_EMULATOR_STORAGE",
    "FIREBASE_EMULATOR_HUB",
    "JWT_SECRET",
    "GOOGLE_MAPS_API_KEY",
  ];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
  }

  return requiredVars.reduce((acc, key) => {
    acc[key] = process.env[key];
    return acc;
  }, {});
};

const getEnv = () => {
  const env = {
    ...loadEnv(),
    ...createNetworkEnv(),
  };

  const envPath = path.join(__dirname, "../../.env");
  const envContent = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  fs.writeFileSync(envPath, envContent);

  return {
    ...env,
    ...process.env,
  };
};

module.exports = {
  getEnv,
};
