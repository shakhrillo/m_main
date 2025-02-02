const { localDocker } = require("./docker");

function isStringObject(str) {
  if (typeof str !== "string") return false;

  try {
    const obj = JSON.parse(str);
    return typeof obj === "object" && obj !== null;
  } catch (e) {
    return false;
  }
}

const checkMachine = async () => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer("gmrsx-machine");

    container.inspect(async (err, data) => {
      if (err) {
        console.error("Error machine container:", err);
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
            console.error("Error getting machine container logs:", err);
            reject(err);
            return;
          }

          const handleData = (chunk) => {
            const data = chunk.toString().replace(/\s+/g, " ").trim();
            data && global.io.emit("docker-build", data);

            if (data.includes("Image build complete.")) {
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
