const { getCheckoutSession } = require("../utils/apiUtils");

async function watchBuyCoins(event) {
  try {
    const { userId } = event.params;
    const { amount } = event.data.data();
    const ref = event.data.ref;
    const { url } = await getCheckoutSession({ userId, amount });
    await ref.update({ url });
  } catch (error) {
    console.error("Error in watchBuyCoins:", error);
  }
}

module.exports = watchBuyCoins;
