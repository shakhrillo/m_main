const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

async function userTopUp(event) {
  const { userId, paymentId } = event.params;
  const snapshot = event.data;
  const { amount } = snapshot.data();

  const db = admin.firestore();
  const earningsRef = db.collection("earnings");

  const userRef = db.doc(`users/${userId}`);
  const batch = db.batch();

  const userDoc = await userRef.get();
  const userDocData = userDoc.data() || {
    coinBalance: 0,
    totalSpent: 0,
  };

  const coinBalance = userDocData.coinBalance + amount;
  const totalSpent = userDocData.totalSpent + amount;

  batch.update(userRef, {
    coinBalance,
    totalSpent,
  });

  batch.set(earningsRef.doc(), {
    amount,
    createdAt: Timestamp.now(),
    userId,
    paymentId,
  });

  await batch.commit();
}

module.exports = userTopUp;
