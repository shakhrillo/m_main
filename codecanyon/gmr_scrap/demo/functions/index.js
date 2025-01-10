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
