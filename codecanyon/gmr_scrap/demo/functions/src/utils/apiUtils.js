const { createToken } = require("./jwtUtils");
const endPointURL = "https://us-central1-gmr-scrap.cloudfunctions.net/api";

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
    makeRequest(`${endPointURL}/machines`, "DELETE", data),
  submitScrapRequest: (data) =>
    makeRequest(`${endPointURL}/scrap`, "POST", data),
  submitScrapInfo: (data) =>
    makeRequest(`${endPointURL}/scrap/info`, "POST", data),
};
