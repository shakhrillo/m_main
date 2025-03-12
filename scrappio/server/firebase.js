const admin = require("firebase-admin");
const path = require("path");

const config = {
  environment: process.env.APP_ENVIRONMENT,
  projectId:
    process.env.APP_ENVIRONMENT === "development"
      ? `demo-${process.env.APP_FIREBASE_PROJECT_ID}`
      : process.env.APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  serviceAccountPath: path.resolve(__dirname, "../firebaseServiceAccount.json"),
  firestoreEmulatorHost: `${process.env.APP_FIREBASE_IPV4_ADDRESS}:${process.env.APP_FIREBASE_EMULATOR_FIRESTORE}`,
};

// Initialize Firebase Admin SDK
const adminOptions = {
  projectId: config.projectId,
  ...(config.environment === "production" && {
    credential: admin.credential.cert(require(config.serviceAccountPath)),
    storageBucket: config.storageBucket,
  }),
};

admin.initializeApp(adminOptions);
const db = admin.firestore();

// Configure Firestore Emulator in Development
if (config.environment === "development") {
  db.settings({ host: config.firestoreEmulatorHost, ssl: false });
}

module.exports = { admin, db };
