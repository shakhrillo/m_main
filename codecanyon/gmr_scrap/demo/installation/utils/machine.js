const { localDocker } = require("./docker");

const checkMachine = async ({ env, emitMessage }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer(`${env.APP_ID}-machine`);

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
