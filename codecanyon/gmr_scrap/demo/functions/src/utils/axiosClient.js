const axios = require("axios");

let baseURL = `http://${process.env.SERVER_IPV4_ADDRESS}:${process.env.APP_SERVER_PORT}`;

console.log('baseURL', baseURL);

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
