const { generateStripePaymentUrl } = require("../services/mainService");

/**
 * Process buy coins
 * @param {functions.EventContext} event
 * @returns {Promise<void>}
 */
const processBuyCoins = async (event) => {
  const ref = event.data.ref;
  const { amount, cost } = event.data.data();
  const { userId } = event.params;

  try {
    await ref.update({
      url: await generateStripePaymentUrl({ userId, amount, cost }),
    });
  } catch (error) {
    const data = error.response.data;
    console.error(data);
    await ref.update({
      ...data,
    });
  }
};

module.exports = processBuyCoins;
