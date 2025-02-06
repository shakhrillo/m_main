const axios = require("axios");

let baseURL = `http://${process.env.SERVER_IP || "host.docker.internal"}:${
  process.env.SERVER_PORT || 1337
}`;

if (process.env.APP_ENVIRONMENT === "production") {
  baseURL = `https://api.gmrscrap.store`;
} else {
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosInstance;
