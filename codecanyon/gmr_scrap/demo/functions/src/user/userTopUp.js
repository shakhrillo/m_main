const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const updateStatistics = require("../services/statisticsService");

/**
 * Updates the user's coin balance and total spent amount.
 * @param {functions.Change} event - Firestore event
 */
const userTopUp = async (event) => {
  const snapshot = event.data;
  const { type, metadata } = snapshot.data();
  const db = admin.firestore();

  if (type !== "charge.succeeded") return;

  try {
    await db.doc(`users/${metadata.userId}`).update({
      coinBalance: FieldValue.increment(Number(metadata.amount) || 0),
      totalSpent: FieldValue.increment(Number(metadata.amount) || 0),
    });
    
    await updateStatistics("earnings");
  } catch (error) {
    console.error("Error updating user balance:", error);
  }
};

module.exports = userTopUp;
