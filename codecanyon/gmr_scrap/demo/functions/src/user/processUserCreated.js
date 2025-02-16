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
  const batch = db.batch();

  /*-------------------*/
  /* Update statistics */
  /*-------------------*/
  await updateStatistics("users");

  /*-------------------*/
  /* Create user       */
  /*-------------------*/
  const userRef = db.collection("users").doc(user.uid);
  batch.set(userRef, {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    phone: user.phoneNumber,
    coinBalance: await settingsService("coins", "bonus") || 0,
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

  await batch.commit();
}

module.exports = processUserCreated;
