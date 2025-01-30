const path = require("path");
const fs = require("fs");
const sourcePath = path.resolve(__dirname, "../../");
const stripeSecretsPath = path.join(sourcePath, "stripe-secrets");

const checkStripe = async () => {
  const checkFile = async () =>
    (await fs.promises.readdir(stripeSecretsPath)).includes(
      "stripe_webhook_secret"
    );

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      if (await checkFile()) {
        clearInterval(interval);
        resolve(true);
      }

      global.io.emit("docker-build", "Waiting for Stripe secrets \n");
    }, 1000);
  });
};

module.exports = checkStripe;
