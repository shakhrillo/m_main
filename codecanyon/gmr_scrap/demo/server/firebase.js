const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
if (!FIREBASE_PROJECT_ID) {
  throw new Error("FIREBASE_PROJECT_ID not found in environment variables");
}

const serviceAccountPath = path.resolve(__dirname, "../firebase.json");
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("firebase.json not found");
}

const firebasekeysPath = path.resolve(__dirname, "../firebasekeys.json");
if (
  process.env.NODE_ENV !== "development" &&
  !fs.existsSync(firebasekeysPath)
) {
  throw new Error("firebasekeys.json not found");
}

admin.initializeApp(
  process.env.NODE_ENV === "development"
    ? { projectId: FIREBASE_PROJECT_ID }
    : {
        credential: admin.credential.cert(firebasekeysPath),
        storageBucket: process.env.STORAGE_BUCKET,
        projectId: FIREBASE_PROJECT_ID,
      }
);

const db = admin.firestore();

if (process.env.NODE_ENV === "development") {
  const serviceAccountJson = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );
  const firestorePort = serviceAccountJson.emulators?.firestore?.port;
  if (firestorePort) {
    db.settings({ host: `localhost:${firestorePort}`, ssl: false });
  } else {
    console.warn("Firestore emulator port not found in firebase.json");
  }
}

module.exports = { admin, db };
