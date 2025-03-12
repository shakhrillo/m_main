require("dotenv").config();
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const processBuyCoins = require("./src/payments/processBuyCoins");
const processUserCreated = require("./src/user/processUserCreated");
const processContainerCreated = require("./src/containers/processContainerCreated");
const userTopUp = require("./src/user/userTopUp");
const processMachineWritten = require("./src/machines/processMachineWritten");
const processUserUpdated = require("./src/user/processUserUpdated");

// Initialize Firebase Admin
admin.initializeApp()

exports.processUserCreated = functions.auth.user().onCreate(processUserCreated);
exports.processUserUpdated = onDocumentUpdated("users/{userId}", processUserUpdated);
exports.processBuyCoins = onDocumentCreated("users/{userId}/buyCoins/{coinId}", processBuyCoins);
exports.userTopUp = onDocumentCreated("payments/{paymentId}", userTopUp);
exports.processContainerCreated = onDocumentCreated("containers/{containerId}", processContainerCreated);
exports.processMachineWritten = onDocumentUpdated("machines/{machineId}", processMachineWritten);
