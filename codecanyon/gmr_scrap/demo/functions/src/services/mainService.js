const axiosInstance = require("../utils/axiosClient");
const { createToken } = require("../utils/jwtUtils");

/**
 * Execute scraping
 * @typedef {{ tag: string, type: string }} Tag
 * @param {Tag} data
 */
const executeScraping = async (data) => {
  const token = createToken(data);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers,
  };

  await axiosInstance.post(`/scrap`, {}, config);
};

/**
 * Generate stripe payment url
 * @typedef {{ userId: string, amount: number }} PaymentData
 * @param {PaymentData} data
 * @returns {Promise<string>}
 */
const generateStripePaymentUrl = async (data) => {
  const token = createToken(data);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers,
  };

  const results = await axiosInstance.post(`/stripe`, {}, config);
  return results.data.url;
};

const updateDockerImages = async () => {
  const token = createToken({});

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers,
  };

  await axiosInstance.post(`/docker/images`, {}, config);
};

module.exports = {
  executeScraping,
  generateStripePaymentUrl,
  updateDockerImages,
};
