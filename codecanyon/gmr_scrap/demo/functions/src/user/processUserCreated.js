const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");
const updateStatistics = require("../services/statisticsService");
const settingsService = require("../services/settingsService");

/**
 * Once a user is created, this function will be triggered.
 * - Update statistics
 * - Create user
 * @param {admin.auth.UserRecord} user
 * @returns {Promise<void>}
 */
async function processUserCreated(user) {
  const db = admin.firestore();
  const bonusCoins = await settingsService("bonus", "coin");
  console.log(`User created: ${user.uid}`, bonusCoins);

  /*-------------------*/
  /* Update statistics */
  /*-------------------*/
  await updateStatistics("users");

  /*-------------------*/
  /* Create user       */
  /*-------------------*/
  const userRef = db.collection("users").doc(user.uid);
  await userRef.set({
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    phone: user.phoneNumber,
    coinBalance: bonusCoins,
    notifications: 0,
    createdAt: Timestamp.now(),
    totalSpent: 0,
    totalReviews: 0,
    totalImages: 0,
    totalVideos: 0,
    totalOwnerReviews: 0,
    totalValidateComments: 0,
    totalValidateInfo: 0,
  });
}

module.exports = processUserCreated;
