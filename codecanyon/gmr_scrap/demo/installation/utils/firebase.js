const axios = require("axios");

const checkFirebase = async () => {
  while (true) {
    try {
      const response = await axios.get("http://0.0.0.0:4400/emulators");
      const data = response.data;

      if (typeof data === "object" && data.auth) {
        global.io.emit("docker-build", "✅ Firebase emulator is ready.\n");
        return true;
      } else {
        global.io.emit(
          "docker-build",
          "⚠️ Firebase emulator not ready. Retrying in 5s...\n"
        );
      }
    } catch (error) {
      global.io.emit(
        "docker-build",
        "⚠️ Error checking Firebase emulator. Retrying in 5s...\n"
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

module.exports = checkFirebase;
