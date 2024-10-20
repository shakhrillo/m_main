// config/firebase.js
const admin = require('firebase-admin');
const path = require('path');

// Load Firebase service account key from a JSON file
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

console.log('serviceAccountPath:', process.env.FIREBASE_DATABASE_URL);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { admin, firestore, auth };
