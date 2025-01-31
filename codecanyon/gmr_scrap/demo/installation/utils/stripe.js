const path = require("path");
const fs = require("fs");
const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

/**
 * Check for Stripe secrets
 * @returns {Promise<boolean>}
 */
const checkStripe = async () => {
  global.io.emit("docker-build", "Checking for Stripe secrets \n");
  const checkFile = async () =>
    (await fs.promises.readdir(stripeSecretsPath)).includes(
      "stripe_webhook_secret"
    );

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      if (await checkFile()) {
        global.io.emit("docker-build", "Stripe secrets found \n");
        clearInterval(interval);
        resolve(true);
      }

      global.io.emit("docker-build", "Waiting for Stripe secrets \n");
    }, 5000);
  });
};

module.exports = checkStripe;
