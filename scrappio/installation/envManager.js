const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

/**
 * Environment manager
 *
 * @class
 * @classdesc Manages the environment variables.
 * @exports EnvManager
 *
 */
class EnvManager {
  #sourcePath = path.resolve(__dirname, "../");
  #envPath = path.join(this.#sourcePath, ".env");
  #requiredVars = [
    "APP_ENVIRONMENT",
    "APP_ID",
    "APP_DOCKER_PORT",
    "APP_CLIENT_PORT",
    "APP_SERVER_PORT",
    "STRIPE_API_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_DEVICE_NAME",
    "STRIPE_SUCCESS_URL",
    "STRIPE_CANCEL_URL",
    "APP_FIREBASE_PROJECT_ID",
    "APP_FIREBASE_EMULATOR_AUTHENTICATION",
    "APP_FIREBASE_EMULATOR_UI",
    "APP_FIREBASE_EMULATOR_FUNCTIONS",
    "APP_FIREBASE_EMULATOR_FIRESTORE",
    "APP_FIREBASE_EMULATOR_STORAGE",
    "APP_FIREBASE_EMULATOR_HUB",
    "JWT_SECRET",
    "GOOGLE_MAPS_API_KEY",
    "GOOGLE_MAPS_ID",
    "API_PRODUCTION_URL",
  ];

  #loadEnv() {
    const { error, parsed } = dotenv.config({ path: this.#envPath });
    if (error) throw new Error(`Failed to load .env: ${error.message}`);

    let missingVars = this.#requiredVars.filter((key) => !process.env[key]);
    if (process.env["APP_ENVIRONMENT"] === "development") {
      missingVars = missingVars.filter((key) => key !== "API_PRODUCTION_URL"); 
      missingVars = missingVars.filter((key) => key !== "STRIPE_WEBHOOK_SECRET");
    }

    if (process.env["APP_ENVIRONMENT"] === "production") {
      missingVars = missingVars.filter((key) => key !== "APP_FIREBASE_EMULATOR_AUTHENTICATION");
      missingVars = missingVars.filter((key) => key !== "APP_FIREBASE_EMULATOR_UI");
      missingVars = missingVars.filter((key) => key !== "APP_FIREBASE_EMULATOR_FUNCTIONS");
      missingVars = missingVars.filter((key) => key !== "APP_FIREBASE_EMULATOR_FIRESTORE");
      missingVars = missingVars.filter((key) => key !== "APP_FIREBASE_EMULATOR_STORAGE");
      missingVars = missingVars.filter((key) => key !== "APP_FIREBASE_EMULATOR_HUB");
      missingVars = missingVars.filter((key) => key !== "STRIPE_DEVICE_NAME");
    }

    if (missingVars.length)
      throw new Error(`Missing env vars: ${missingVars.join(", ")}`);

    return parsed;
  }

  #createNetworkEnv() {
    const subnetBase = `192.168.${Math.floor(Math.random() * 256)}`;
    return {
      NETWORK_SUBNET: `${subnetBase}.0/24`,
      DOCKER_IPV4_ADDRESS: `${subnetBase}.2`,
      MACHINE_IPV4_ADDRESS: `${subnetBase}.3`,
      APP_FIREBASE_IPV4_ADDRESS: `${subnetBase}.4`,
      SERVER_IPV4_ADDRESS: `${subnetBase}.5`,
      CLIENT_IPV4_ADDRESS: `${subnetBase}.6`,
      STRIPE_IPV4_ADDRESS: `${subnetBase}.7`,
    };
  }

  getEnv() {
    const env = { ...this.#loadEnv(), ...this.#createNetworkEnv() };
    const newEnv = Object.entries(env)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    fs.writeFileSync(this.#envPath, newEnv);
    return { ...env, ...process.env };
  }
}

module.exports = new EnvManager();
