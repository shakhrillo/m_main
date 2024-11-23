const admin = require("firebase-admin");
const { getCheckoutSessionUrl } = require("../utils/stripeUtils");

async function watchBuyCoins(event) {
  const { userId } = event.params;
  const { amount } = event.data.data();
  console.log(`User ${userId} is buying ${amount} coins`);
  // const batch = admin.firestore().batch();

  // try {
  //   const url = await getCheckoutSessionUrl(amount, userId);
  //   await batch.set(admin.firestore().collection(`users/${userId}/buy`).doc(), {
  //     url,
  //   });
  //   await batch.commit();
  // } catch (error) {
  //   console.error("Error creating Stripe session:", error);
  // }
}

module.exports = watchBuyCoins;
