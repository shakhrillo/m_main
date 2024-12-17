const axios = require("axios");
const { createToken } = require("../utils/jwtUtils");
const endPointURL = process.env.ENDPOINT_URL;

const watchBuyCoins = async ({ params: { userId }, data }) => {
  try {
    const { amount } = data.data();

    console.log("---".repeat(40));
    console.log("watchBuyCoins:", userId, amount);
    console.log("---".repeat(40));

    const token = createToken({
      userId,
      amount,
    });

    const { url } = await axios.post(
      `https://api.gmrscrap.store/stripe`,
      { amount },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("url", url);

    // await data.ref.update({ url });
  } catch (error) {
    console.error("Error in watchBuyCoins:", error);
  }
};

module.exports = watchBuyCoins;
