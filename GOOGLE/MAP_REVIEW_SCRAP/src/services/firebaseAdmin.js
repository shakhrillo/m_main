const admin = require("firebase-admin");
require('dotenv').config();
const firebaseKey = JSON.parse(Buffer.from(process.env.FIREBASE_KEY_BASE64, "base64").toString("utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey)
});

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = {
  firestore,
  auth
}