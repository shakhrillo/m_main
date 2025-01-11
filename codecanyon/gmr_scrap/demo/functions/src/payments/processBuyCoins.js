const { generateStripePaymentUrl } = require("../services/mainService");

/**
 * Process buy coins
 * @param {functions.EventContext} event
 * @returns {Promise<void>}
 */
const processBuyCoins = async (event) => {
  const ref = event.data.ref;
  const { amount } = event.data.data();
  const { userId } = event.params;

  await ref.update({
    url: await generateStripePaymentUrl({ userId, amount }),
  });
};

module.exports = processBuyCoins;
