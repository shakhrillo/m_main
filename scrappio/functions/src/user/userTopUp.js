const { FieldValue } = require("firebase-admin/firestore");
const updateStatistics = require("../services/statisticsService");
const { updateUser } = require("../services/userService");

/**
 * Updates the user's coin balance and total spent amount.
 * @param {functions.Change} event - Firestore event
 */
const userTopUp = async (event) => {
  const snapshot = event.data;
  const { type, metadata, amount } = snapshot.data();

  if (type !== "charge.succeeded") return;

  try {
    const coinBalance = Number(metadata.amount || 0);
    await updateUser(metadata.userId, {
      coinBalance: FieldValue.increment(coinBalance),
      totalSpent: FieldValue.increment(coinBalance),
    });
    await updateStatistics("earnings", amount);
  } catch (error) {
    console.error("Error updating user balance:", error);
  }
};

module.exports = userTopUp;
