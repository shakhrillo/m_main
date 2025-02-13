const fs = require("fs");
const path = require("path");
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
const processContainerCreated = require("./src/containers/processContainerCreated");
const processContainerWritten = require("./src/containers/processContainerWritten");
const userTopUp = require("./src/user/userTopUp");

const {
  updateDockerImages,
  getDockerInfo,
} = require("./src/services/mainService");
const processMachineWritten = require("./src/machines/processMachineWritten");
const processSettingsWritten = require("./src/settings/processSettingsWritten");
const jsonPath = path.join(__dirname, "assets/fake-data.json");


admin.initializeApp()

exports.processUserCreated = functions.auth.user().onCreate(processUserCreated);

exports.processBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  processBuyCoins
);

exports.userTopUp = onDocumentCreated("payments/{paymentId}", userTopUp);

exports.processContainerCreated = onDocumentCreated(
  "containers/{containerId}",
  processContainerCreated
);

exports.processContainerWritten = onDocumentWritten(
  "containers/{containerId}",
  processContainerWritten
);

exports.processSettingsWritten = onDocumentWritten(
  "settings/{settingsId}",
  processSettingsWritten
);

exports.processMachineWritten = onDocumentWritten(
  "machines/{machineId}",
  processMachineWritten
);
