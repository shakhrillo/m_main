const { localDocker } = require("./docker");

const checkServer = async ({ emitMessage }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer("gmrsx-server");

    container.inspect(async (err, data) => {
      if (err) {
        emitMessage(err);
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
            emitMessage(err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            emitMessage(chunk);

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
