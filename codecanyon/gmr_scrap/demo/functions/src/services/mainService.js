// const axiosInstance = require("../utils/axiosClient");
const { createToken } = require("../utils/jwtUtils");
const axios = require("axios");

let baseURL = `http://${process.env.SERVER_IPV4_ADDRESS}:${process.env.APP_SERVER_PORT}`;
if (process.env.APP_ENVIRONMENT === "production") {
  baseURL = process.env.API_PRODUCTION_URL;
}

const api = axios.create({ baseURL });

/**
 * Execute scraping
 * @typedef {{ tag: string, type: string }} Tag
 * @param {Tag} data
 * @returns {Promise<void>}
 */
const executeScraping = async (data) => {
  const token = createToken(data);
  await api.post(`/scrap`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

/**
 * Generate Stripe payment URL
 * @typedef {{ userId: string, amount: number }} PaymentData
 * @param {PaymentData} data
 * @returns {Promise<string>}
 */
const generateStripePaymentUrl = async (data) => {
  const token = createToken(data);
  const response = await api.post(`/stripe`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return response.data.url;
};

/**
 * Update Docker images
 * @returns {Promise<void>}
 */
const updateDockerImages = async () => {
  const token = createToken({});
  await api.post(`/docker/images`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

/**
 * Get Docker info
 * @returns {Promise<object>}
 */
const getDockerInfo = async () => {
  const token = createToken({});
  const response = await api.get(`/docker/info`, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

module.exports = {
  executeScraping,
  generateStripePaymentUrl,
  updateDockerImages,
  getDockerInfo,
};
