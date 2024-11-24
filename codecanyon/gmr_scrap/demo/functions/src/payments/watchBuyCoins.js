const { getCheckoutSession } = require("../utils/apiUtils");

const watchBuyCoins = async ({ params: { userId }, data }) => {
  try {
    const { amount } = data.data();
    const { url } = await getCheckoutSession({ userId, amount });
    await data.ref.update({ url });
  } catch (error) {
    console.error("Error in watchBuyCoins:", error);
  }
};

module.exports = watchBuyCoins;
