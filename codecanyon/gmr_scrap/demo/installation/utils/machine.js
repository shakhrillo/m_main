const { log } = require("../services/logger");
const { localDocker } = require("./docker");

const checkMachine = async ({ env }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer(`${env.APP_ID}-machine`);

    container.inspect(async (err, data) => {
      if (err) {
        log(err);
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
            log(err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            log(chunk);

            if (chunk.toString().includes("Image build complete.")) {
              stream.removeListener("data", handleData);
              stream.destroy();
              resolve("Machine image is ready.");
            }
          };

          stream.on("data", handleData);
        }
      );
    });
  });
};

module.exports = checkMachine;
