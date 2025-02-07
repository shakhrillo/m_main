const { log } = require("./logger");
const { localDocker } = require("./docker");

const checkServer = async ({ env }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer(`${env.APP_ID}-server`);

    container.inspect(async (err, data) => {
      if (err) {
        log("[server]: " + err);
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
            log("[server]: " + err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            log("[server]: " + chunk);

            if (chunk.toString().includes("Server is running on port")) {
              stream.removeListener("data", handleData);
              stream.destroy();
              resolve("Server is ready.");
            }
          };

          stream.on("data", handleData);
        }
      );
    });
  });
};

module.exports = checkServer;
