const axios = require("../utils/axiosClient");
const { createToken } = require("../utils/jwtUtils");

const processBuyCoins = async (event) => {
  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  try {
    const amount = snapshot.data().amount;
    const userId = event.params.userId;

    const token = createToken({
      userId,
      amount,
    });

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const config = {
      headers,
    };

    const data = await axios.post(`/stripe`, {}, config);
    const url = data.data.url;

    await snapshot.ref.update({ url });
  } catch (error) {
    console.error("Error processing buy coins", error);
  } finally {
    console.log("Buy coins processed");
  }
};

module.exports = processBuyCoins;
