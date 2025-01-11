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

module.exports = {
  executeScraping,
};
