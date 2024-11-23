// firebase.js
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  projectId: "demo-project-id",
});

// Connect Firestore to the Emulator
const db = admin.firestore();
db.settings({
  host: "localhost:9100", // Firestore emulator host
  ssl: false, // Disable SSL for emulator
});

module.exports = { admin, db };
