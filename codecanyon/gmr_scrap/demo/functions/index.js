require("dotenv").config();
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentWritten,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const watchBuyCoins = require("./src/payments/watchBuyCoins");
const userCreate = require("./src/user/userCreate");
const processReviewCreated = require("./src/containers/processReviewCreated");
const processContainerWritten = require("./src/containers/processContainerWritten");

admin.initializeApp();

exports.userCreate = functions.auth.user().onCreate(userCreate);

exports.watchBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  watchBuyCoins
);

exports.watchReview = onDocumentCreated(
  "users/{userId}/reviews/{reviewId}",
  processReviewCreated
);

exports.watchContainers = onDocumentWritten(
  "container/{containerId}",
  processContainerWritten
);
