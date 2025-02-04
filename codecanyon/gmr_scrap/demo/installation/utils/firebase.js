const { localDocker } = require("./docker");

const checkFirebase = async ({ env, emitMessage }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer(`${env.APP_ID}-firebase`);

    container.inspect(async (err, data) => {
      if (err) {
        emitMessage("[firebase]: " + err);
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
            emitMessage("[firebase]: " + err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            emitMessage("[firebase]: " + chunk);

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
