const axios = require("axios");

let baseURL = `http://${process.env.SERVER_IPV4_ADDRESS}:${process.env.SERVER_PORT}`;

if (process.env.APP_ENVIRONMENT === "production") {
  baseURL = process.env.API_PRODUCTION_URL;
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosInstance;
