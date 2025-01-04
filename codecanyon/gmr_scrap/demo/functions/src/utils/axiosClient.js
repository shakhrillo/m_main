const axios = require("axios");
const baseURL = `http://${process.env.SERVER_IP || "host.docker.internal"}:${
  process.env.SERVER_PORT || 1337
}`;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosInstance;
