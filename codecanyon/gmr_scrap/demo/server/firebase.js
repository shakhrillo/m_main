const admin = require("firebase-admin");
const path = require("path");
const environment = process.env.APP_ENVIRONMENT;
const storageBucket = process.env.STORAGE_BUCKET;

const firebasekeysPath = path.resolve(
  __dirname,
  "../firebaseServiceAccount.json"
);

admin.initializeApp({
  projectId:
    process.env.APP_ENVIRONMENT === "development"
      ? `demo-${process.env.APP_FIREBASE_PROJECT_ID}`
      : `${process.env.APP_FIREBASE_PROJECT_ID}`,
  ...(environment === "production" && {
    credential: admin.credential.cert(firebasekeysPath),
    storageBucket,
  }),
});

const db = admin.firestore();

if (environment === "development") {
  db.settings({
    host: `${process.env.APP_FIREBASE_IPV4_ADDRESS}:${process.env.APP_FIREBASE_EMULATOR_FIRESTORE}`,
    ssl: false,
  });
}

module.exports = { admin, db };
