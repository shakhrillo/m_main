const axios = require("axios");

const checkFirebase = async () => {
  try {
    const response = await axios.get("http://0.0.0.0:4400/emulators");
    const data = response.data;

    if (typeof data === "object" && data.auth) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Error checking Firebase emulators", error);
  }
};

module.exports = checkFirebase;
