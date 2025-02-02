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

const checkMachine = async ({ emitMessage }) => {
  return new Promise(async (resolve, reject) => {
    const container = localDocker.getContainer("gmrsx-machine");

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
