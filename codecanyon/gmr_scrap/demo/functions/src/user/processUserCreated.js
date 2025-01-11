const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

/**
 * Once a user is created, this function will be triggered.
 * - Update statistics
 * - Create user
 * @param {functions.auth.UserRecord} user
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
    total: admin.firestore.FieldValue.increment(1),
  });

  /*-------------------*/
  /* Create user       */
  /*-------------------*/
  const userRef = db.doc(`users/${uid}`);
  batch.set(userRef, {
    ...user.toJSON(),
    coinBalance: 100,
    notifications: 0,
    createdAt: Timestamp.now(),
  });

  await batch.commit();
}

module.exports = processUserCreated;
