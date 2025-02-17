const { log } = require("./logger");
const { localDocker } = require("./docker");

const checkServer = async () => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer(`${process.env.APP_ID}-server`);

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

            if (chunk.toString().includes("Server running on port")) {
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
