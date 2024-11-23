require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/firestore");
const watchBuyCoins = require("./src/payments/watchBuyCoins");

admin.initializeApp();

exports.watchBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  watchBuyCoins
);
