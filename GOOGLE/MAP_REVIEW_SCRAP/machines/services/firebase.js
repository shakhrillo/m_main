const admin = require("firebase-admin");
require("dotenv").config();
const firebaseKey = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY_BASE64, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey),
  storageBucket: process.env.STORAGE_BUCKET,
});

const firestore = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

module.exports = {
  firestore,
  auth,
  bucket,
};
