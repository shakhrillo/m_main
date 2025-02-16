const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

async function userTopUp(event) {
  const snapshot = event.data;
  const { type, metadata } = snapshot.data();
  /**
   * @type {import("firebase-admin").firestore.Firestore}
   * The Firestore instance.
   **/
  const db = admin.firestore();

  if (type === "charge.succeeded") {
    try {
      const userRef = db.doc(`users/${metadata.userId}`);
      const batch = db.batch();
    
      batch.update(userRef, {
        coinBalance: FieldValue.increment(metadata.amount),
        totalSpent: FieldValue.increment(metadata.amount),
      });
    
      await batch.commit();
    } catch (error) {
      console.error("Error updating user balance: ", error);
    }
  }
}

module.exports = userTopUp;
