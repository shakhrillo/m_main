require("dotenv").config();
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
const { Timestamp, GeoPoint } = require("firebase-admin/firestore");
const processBuyCoins = require("./src/payments/processBuyCoins");

const processUserCreated = require("./src/user/processUserCreated");
const processReviewCreated = require("./src/containers/processReviewCreated");
const processContainerWritten = require("./src/containers/processContainerWritten");
const userTopUp = require("./src/user/userTopUp");

// import json
const fs = require("fs");
const path = require("path");
const { updateDockerImages } = require("./src/services/mainService");
const jsonPath = path.join(__dirname, "assets/fake-data.json");

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

const init = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // wait emulators to be ready
  const maxRetries = 10;
  let retries = 0;
  let db;
  while (retries < maxRetries) {
    try {
      db = admin.firestore();
      await db.collection("test").doc("test").set({ test: "test" });
      console.log("Emulators are ready");
      break;
    } catch (error) {
      console.log("Waiting for emulators to be ready...", error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }
  }

  // const db = admin.firestore();
  const batch = db.batch();

  /*-------------------*/
  /* Docker            */
  /*-------------------*/
  // wait for JWT_SECRET to be available
  // let retries = 0;
  // while (!process.env.JWT_SECRET && retries < 10) {
  //   console.log("Waiting for JWT_SECRET...", process.env);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   retries++;
  // }

  console.log("JWT", process.env.JWT_SECRET);

  await updateDockerImages();

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
    "earnings",
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
    const months = 12;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const earnings = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(year, month - i, 1);
      const timestamp = Timestamp.fromDate(date);
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

  /*-------------------*/
  /* Fake data         */
  /*-------------------*/
  const data = JSON.parse(fs.readFileSync(jsonPath));
  const containerRef = db.collection("containers");
  for (const container of data) {
    const ref = containerRef.doc(`${container.type}_${container.reviewId}`);
    batch.set(ref, {
      ...container,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      location: new GeoPoint(container.location[0], container.location[1]),
    });
  }

  await batch.commit();
};

setTimeout(() => {
  init().catch(console.error);
}, 10000);
