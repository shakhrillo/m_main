const { localDocker } = require("./docker");

const checkServer = async () => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer("gmrsx-server");

    container.inspect(async (err, data) => {
      if (err) {
        console.error("Error inspecting Server container:", err);
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
            console.error("Error getting Server container logs:", err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            const data = chunk.toString().trim();
            data && global.io.emit("docker-build", data);

            if (data.includes("Server is running on port")) {
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
