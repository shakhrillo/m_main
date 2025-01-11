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

(() => {
  console.log("-".repeat(40));
  console.log("Setting up initial statistics");
  console.log("-".repeat(40));

  const db = admin.firestore();
  const batch = db.batch();

  const statisticsRef = db.doc("statistics/info");
  batch.set(statisticsRef, {
    total: 0,
  });

  const commentsRef = db.doc("statistics/comments");
  batch.set(commentsRef, {
    total: 0,
  });

  const usersRef = db.doc("statistics/users");
  batch.set(usersRef, {
    total: 0,
  });

  return batch.commit();
})();
