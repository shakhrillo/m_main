require("dotenv").config();
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const { onDocumentCreated } = require("firebase-functions/firestore");
const watchBuyCoins = require("./src/payments/watchBuyCoins");
const userCreate = require("./src/user/userCreate");

admin.initializeApp();

exports.userCreate = functions.auth.user().onCreate(userCreate);
exports.watchBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  watchBuyCoins
);
