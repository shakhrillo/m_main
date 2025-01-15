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

  await batch.commit();
})();
