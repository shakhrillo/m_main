// config/firebase.js
const admin = require('firebase-admin');
const path = require('path');

// Load Firebase service account key from a JSON file
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// set emulators
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Initialize Firestore
admin.firestore().settings({
  host: 'localhost:8080',
  ssl: false
});

// Initialize Authentication
// admin.auth().useEmulator('http://localhost:9099');

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { admin, firestore, auth };
