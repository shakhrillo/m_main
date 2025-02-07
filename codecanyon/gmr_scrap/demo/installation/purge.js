const fs = require("fs/promises");
const path = require("path");

const sourcePath = path.resolve(__dirname, "../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");
const installLogPath = path.join(sourcePath, "install.log");

/**
 * Safely removes a directory and its contents.
 * @param {string} dirPath - The directory path to remove.
 * @returns {Promise<void>}
 */
const removeDirectory = async (dirPath) => {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    console.error(`Failed to remove directory at ${dirPath}: ${error.message}`);
  }
};

/**
 * Creates the stripe-secrets directory if it doesn't exist.
 * @returns {Promise<void>}
 */
const createStripeSecretsDirectory = async () => {
  try {
    await fs.mkdir(stripeSecretsPath, { recursive: true });
  } catch (error) {
    console.error(
      `Failed to create directory at ${stripeSecretsPath}: ${error.message}`
    );
  }
};

/**
 * Removes the install log file.
 * @returns {Promise<void>}
 */
const removeInstallLog = async () => {
  try {
    await fs.rm(installLogPath, { force: true });
  } catch (error) {
    console.error(
      `Failed to remove install log at ${installLogPath}: ${error.message}`
    );
  }
};

/**
 * Purges the installation by removing and recreating necessary directories and files.
 * @returns {Promise<void>}
 */
const purge = async () => {
  await removeDirectory(stripeSecretsPath);
  await createStripeSecretsDirectory();
  await removeInstallLog();
};

module.exports = purge;
