const admin = require("firebase-admin");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");

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
  const statisticsRef = db.doc(`statistics/users`);
  batch.update(statisticsRef, {
    total: FieldValue.increment(1),
  });

  /*-------------------*/
  /* Create user       */
  /*-------------------*/
  const userRef = db.collection("users").doc();
  batch.set(userRef, {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    phone: user.phoneNumber,
    coinBalance: 100,
    notifications: 0,
    createdAt: Timestamp.now(),
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
