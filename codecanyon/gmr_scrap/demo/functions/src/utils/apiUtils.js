const { createToken } = require("./jwtUtils");
const endPointURL = process.env.ENDPOINT_URL;

const createAuthHeader = (data) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${createToken(data)}`,
});

const handleResponse = async (response) => {
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
};

const makeRequest = async (url, method, data) => {
  try {
    const response = await fetch(url, {
      method,
      headers: createAuthHeader(data),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error with ${method} request to ${url}:`, error);
    throw error;
  }
};

module.exports = {
  deleteMachine: (data) =>
    makeRequest(`${endPointURL}/api/machines`, "DELETE", data),
  submitScrapRequest: (data) =>
    makeRequest(`${endPointURL}/api/scrap`, "POST", data),
  submitScrapInfo: (data) =>
    makeRequest(`${endPointURL}/api/scrap/info`, "POST", data),
  getCheckoutSession: (data) =>
    makeRequest(`${endPointURL}/api/stripe`, "POST", data),
};
