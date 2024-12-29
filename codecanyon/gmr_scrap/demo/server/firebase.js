const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const environment = process.env.NODE_ENV || "development";
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const storageBucket = process.env.STORAGE_BUCKET;

const firebasekeysPath = path.resolve(__dirname, "../firebasekeys.json");

admin.initializeApp({
  projectId: firebaseProjectId,
  ...(environment === "production" && {
    credential: admin.credential.cert(firebasekeysPath),
    storageBucket,
  }),
});

const db = admin.firestore();

if (environment === "development") {
  db.settings({
    host: `${process.env.FIREBASE_IP}:${process.env.FIRESTORE_EMULATOR_PORT}`,
    ssl: false,
  });
}

module.exports = { admin, db };
