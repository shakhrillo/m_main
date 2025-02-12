const admin = require("firebase-admin");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");

async function userTopUp(event) {
  const { paymentId } = event.params;
  const snapshot = event.data;
  const { amount, type, metadata } = snapshot.data();

  // console.log("data", snapshot.data());

  if (type !== "charge.succeeded") {
    return;
  }

  /**
   * @type {import("firebase-admin").firestore.Firestore}
   * The Firestore instance.
   **/
  const db = admin.firestore();
  // const userId = snapshot.metadata.userId;
  // const earningsRef = db.collection("earnings");

  // const statisticsRef = db.doc("statistics/earnings");
  const userRef = db.doc(`users/${metadata.userId}`);
  const batch = db.batch();

  // const userDoc = await userRef.get();
  // const userDocData = userDoc.data() || {
  //   coinBalance: 0,
  //   totalSpent: 0,
  // };

  // const coinBalance = userDocData.coinBalance + amount;
  // const totalSpent = userDocData.totalSpent + amount;

  batch.update(userRef, {
    coinBalance: FieldValue.increment(amount),
    totalSpent: FieldValue.increment(amount),
  });

  // batch.set(earningsRef.doc(), {
  //   amount,
  //   createdAt: Timestamp.now(),
  //   userId,
  //   paymentId,
  // });

  // if (statisticsRef && statisticsRef.exists) {
  //   batch.update(statisticsRef, {
  //     total: admin.firestore.FieldValue.increment(amount),
  //   });
  // } else {
  //   batch.set(statisticsRef, {
  //     total: amount,
  //   });
  // }

  await batch.commit();
}

module.exports = userTopUp;
