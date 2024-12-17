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
  const serviceAccountPath = path.resolve(__dirname, "../firebase.json");
  let serviceAccountJson = {};

  if (fs.existsSync(serviceAccountPath)) {
    serviceAccountJson = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );
  } else {
    console.log("\x1b[31m%s\x1b[0m", "Firebase service account file not found");
  }

  const firestorePort = serviceAccountJson.emulators?.firestore?.port || 9100;
  db.settings({ host: `localhost:${firestorePort}`, ssl: false });
}

module.exports = { admin, db };
