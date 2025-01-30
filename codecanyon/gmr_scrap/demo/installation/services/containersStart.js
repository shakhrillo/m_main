const compose = require("docker-compose");
const env = require("./env");
const checkStripe = require("../utils/stripe");

const containersStart = async (req, res) => {
  try {
    await compose.upAll({
      env,
      callback: (chunk) => {
        global.io.emit("containers-start", chunk.toString());
      },
    });

    await checkStripe();

    global.io.emit("containers-start", "Containers started successfully \n");

    res.send({
      message: "Containers started successfully",
      status: "success",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error starting containers");
  }
};

module.exports = containersStart;
