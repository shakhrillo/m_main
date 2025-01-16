require("dotenv").config();
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
const processBuyCoins = require("./src/payments/processBuyCoins");

const processUserCreated = require("./src/user/processUserCreated");
const processReviewCreated = require("./src/containers/processReviewCreated");
const processContainerWritten = require("./src/containers/processContainerWritten");
const userTopUp = require("./src/user/userTopUp");

admin.initializeApp();

exports.processUserCreated = functions.auth.user().onCreate(processUserCreated);

exports.processBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  processBuyCoins
);

exports.userTopUp = onDocumentCreated(
  "users/{userId}/payments/{paymentId}",
  userTopUp
);

exports.processReviewCreated = onDocumentCreated(
  "users/{userId}/reviews/{reviewId}",
  processReviewCreated
);

exports.processContainerWritten = onDocumentWritten(
  "containers/{containerId}",
  processContainerWritten
);

(async () => {
  const db = admin.firestore();
  const batch = db.batch();

  /*-------------------*/
  /* Statistics        */
  /*-------------------*/
  const statisticsRef = db.collection("statistics");
  const types = [
    "comments",
    "info",
    "users",
    "totalReviews",
    "totalImages",
    "totalVideos",
    "totalOwnerReviews",
    "totalValidateComments",
    "totalValidateInfo",
  ];
  for (const type of types) {
    const ref = statisticsRef.doc(type);
    const doc = await ref.get();
    if (doc.exists) continue;

    batch.set(ref, {
      total: 0,
    });
  }

  /*-------------------*/
  /* Settings          */
  /*-------------------*/
  const settingsPricesRef = db.doc("settings/prices");
  const settingsPricesSnap = await settingsPricesRef.get();
  if (!settingsPricesSnap.exists) {
    batch.set(settingsPricesRef, {
      image: 2,
      video: 3,
      response: 1,
      review: 1,
      validation: 3,
    });
  }

  /*-------------------*/
  /* Fake earnings     */
  /*-------------------*/
  const earningsRef = db.collection("earnings");
  const earningsSnap = await earningsRef.get();
  if (earningsSnap.empty) {
    // Add dummy data for the last 6 months
    // amount: number
    // createdAt: admin.firestore.Timestamp
    // paymentId: string
    // userId: string
    const months = 12;
    const now = new Date();
    const nowTimestamp = admin.firestore.Timestamp.fromDate(now);
    const month = now.getMonth();
    const year = now.getFullYear();
    const earnings = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(year, month - i, 1);
      const timestamp = admin.firestore.Timestamp.fromDate(date);
      const amount = Math.floor(Math.random() * 14000) + 1000;
      earnings.push({
        amount,
        createdAt: timestamp,
        paymentId: `payment-${i}`,
        userId: "user",
      });
    }

    for (const earning of earnings) {
      const ref = earningsRef.doc(earning.paymentId);
      batch.set(ref, earning);
    }

    // Add the total earnings to statistics
    const totalEarningsRef = db.doc("statistics/earnings");
    const totalEarningsSnap = await totalEarningsRef.get();
    if (!totalEarningsSnap.exists) {
      batch.set(totalEarningsRef, {
        total: earnings.reduce((acc, curr) => acc + curr.amount, 0),
      });
    }
  }

  await batch.commit();
})();
