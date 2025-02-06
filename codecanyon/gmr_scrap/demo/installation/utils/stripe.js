const { log } = require("../services/logger");
const { localDocker } = require("./docker");

/**
 * Check for Stripe secrets
 * @returns {Promise<boolean>}
 */
const checkStripe = async ({ env }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer(`${env.APP_ID}-stripe-cli`);

    container.inspect(async (err, data) => {
      if (err) {
        log("[stripe]: " + err);
        reject(err);
        return;
      }

      container.logs(
        {
          follow: true,
          stdout: true,
          stderr: true,
        },
        (err, stream) => {
          if (err) {
            log("[stripe]: " + err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            log("[stripe]: " + chunk);

            if (chunk.toString().includes("Ready!")) {
              stream.removeListener("data", handleData);
              stream.destroy();
              resolve("Stripe CLI is ready.");
            }
          };

          stream.on("data", handleData);
        }
      );
    });
  });
};

module.exports = checkStripe;
