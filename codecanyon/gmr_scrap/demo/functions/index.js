require("dotenv").config();
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentWritten,
  onDocumentUpdated,
} = require("firebase-functions/firestore");
const watchBuyCoins = require("./src/payments/watchBuyCoins");
const userCreate = require("./src/user/userCreate");
const getPlaceOverview = require("./src/machines/getPlaceOverview");
const getPlaceReview = require("./src/machines/getPlaceReviews");
const watchSettings = require("./src/settings/watchSettings");
const watchMachine = require("./src/machines/watchMachine");
const watchReview = require("./src/machines/watchReview");

admin.initializeApp();

exports.appInit = onDocumentUpdated("app/{appId}", watchSettings);
exports.userCreate = functions.auth.user().onCreate(userCreate);
exports.watchBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  watchBuyCoins
);

exports.watchNewReview = onDocumentCreated(
  "users/{userId}/reviews/{reviewId}",
  getPlaceReview
);
exports.watchReviewUpdates = onDocumentUpdated(
  "users/{userId}/reviews/{reviewId}",
  watchReview
);

exports.watchReviewOverview = onDocumentCreated(
  "users/{userId}/reviewOverview/{reviewId}",
  getPlaceOverview
);

// exports.watchMachines = onDocumentUpdated("machines/{machineId}", watchMachine);
