const { Timestamp } = require("firebase-admin/firestore");
const updateStatistics = require("../services/statisticsService");
const settingsService = require("../services/settingsService");
const updateUser = require("../services/userService");

/**
 * Once a user is created, this function will be triggered.
 * - Update statistics
 * - Create user
 * @param {Object} user
 * @returns {Promise<void>}
 */
async function processUserCreated(user) {
  const bonusCoins = await settingsService("bonus", "coin");

  /*-------------------*/
  /* Update statistics */
  /*-------------------*/
  await updateStatistics("users");

  /*-------------------*/
  /* Create user       */
  /*-------------------*/
  await updateUser(user.uid, {
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
    isAdmin: false,
    isEditor: false
  });
}

module.exports = processUserCreated;
