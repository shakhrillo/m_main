const { localDocker } = require("./docker");

/**
 * Check for Stripe secrets
 * @returns {Promise<boolean>}
 */
const checkStripe = async () => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer("gmrsx-stripe-cli");

    container.inspect(async (err, data) => {
      if (err) {
        console.error("Error inspecting Stripe container:", err);
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
            console.error("Error getting Stripe container logs:", err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            const data = chunk.toString().replace(/\s+/g, " ").trim();
            data && global.io.emit("docker-build", data);

            if (data.includes("Ready!")) {
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
