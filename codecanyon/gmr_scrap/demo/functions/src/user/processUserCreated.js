const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

async function processUserCreated({ uid, email, displayName }) {
  await admin.firestore().collection("users").doc(uid).set({
    email,
    displayName,
    coinBalance: 100,
    notifications: 0,
    createdAt: Timestamp.now(),
  });
}

module.exports = processUserCreated;
