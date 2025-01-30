const compose = require("docker-compose");
const checkMachine = require("../utils/machine");
const checkFirebase = require("../utils/firebase");
const checkServer = require("../utils/server");

const containersStart = async (req, res) => {
  try {
    await compose.upAll({
      env: process.env,
      callback: (chunk) => {
        global.io.emit("containers-start", chunk.toString());
      },
    });

    let isMachineAvailable;
    let check = true;
    let count = 0;
    while (check && count < 10) {
      global.io.emit(
        "containers-start",
        `#${count} Validating... \n Machine: ${isMachineAvailable} \n`
      );
      try {
        isMachineAvailable = await checkMachine();

        if (isMachineAvailable) {
          check = false;
        }
      } catch (err) {
        console.error(`Error: ${err} \n`);
      } finally {
        count++;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    global.io.emit("containers-start", "Machine started successfully \n");

    let isFirebaseAvailable;
    let isServerAvailable;
    check = true;
    count = 0;
    while (check && count < 10) {
      global.io.emit(
        "containers-start",
        `#${count} Validating... \n Firebase: ${isFirebaseAvailable}, Server: ${isServerAvailable} \n`
      );

      try {
        if (!isFirebaseAvailable) {
          isFirebaseAvailable = await checkFirebase();
        }
        if (!isServerAvailable) {
          isServerAvailable = await checkServer();
        }

        if (isFirebaseAvailable && isServerAvailable) {
          check = false;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (err) {
        console.error(`Error: ${err} \n`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } finally {
        count++;
      }
    }

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
