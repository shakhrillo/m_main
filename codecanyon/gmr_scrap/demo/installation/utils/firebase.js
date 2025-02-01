const { localDocker } = require("./docker");

const checkFirebase = async () => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer("gmrsx-firebase");

    container.inspect(async (err, data) => {
      if (err) {
        console.error("Error inspecting Firebase container:", err);
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
            console.error("Error getting Firebase container logs:", err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            const data = chunk.toString();
            global.io.emit("docker-build", data);

            if (data.includes("All emulators ready!")) {
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
