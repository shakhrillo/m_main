const axios = require("axios");
const { localDocker } = require("./docker");

const checkServer = async () => {
  const SERVER_PORT = process.env.SERVER_PORT;

  if (!SERVER_PORT) {
    throw new Error("SERVER_PORT is not defined");
  }

  try {
    const container = localDocker.getContainer("gmrsx_server");
    await container.restart();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await axios.get(`http://0.0.0.0:${SERVER_PORT}`);

    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    throw new Error(`Error checking server: ${error.message}`);
  }
};

module.exports = checkServer;
