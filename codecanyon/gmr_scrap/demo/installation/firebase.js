const { log } = require("./logger");
const { localDocker } = require("./docker");

const checkFirebase = async () => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer(
      `${process.env.APP_ID}-firebase`
    );

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

            if (
              chunk.toString().includes("All emulators ready!") ||
              chunk.toString().includes("Deploy complete!")
            ) {
              stream.removeListener("data", handleData);
              stream.destroy();
              resolve("Firebase emulator is ready. You can now run the tests.");
            }
          };

          stream.on("data", handleData);
        }
      );
    });
  });
};

module.exports = checkFirebase;
