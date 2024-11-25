const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
require("dotenv").config();
// const firebaseKey = JSON.parse(
//   Buffer.from(process.env.FIREBASE_KEY_BASE64, "base64").toString("utf-8")
// );

console.log("--+->", process.env["FIRESTORE_EMULATOR_HOST"]);

const app = admin.initializeApp();
// ({
//   // projectId: "fir-scrapp",
//   // credential: admin.credential.cert(firebaseKey),
//   // storageBucket: "gs://fir-scrapp.firebasestorage.app",
// });

const firestore = admin.firestore();
// firestore.settings({
// ""
// host: "host.docker.internal:9100",
// ssl: false,
// });
const auth = admin.auth();
// const storage = getStorage(app);
// auth.useEmulator("http://localhost:9099");
// const storage = admin.storage();

// const storage = getStorage();
// const bucket = storage.bucket("fir-scrapp.appspot.com");

// storage.useEmulator("host.docker.internal", 9199);
// const bucket = storage.bucket("fir-scrapp.appspot.com");
// const bucket = admin.storage().bucket("fir-scrapp.appspot.com");

// check bucket emulator

// bucket;
// bucket.useEmulator("host.docker.internal", 9199);

async function batchWriteLargeArray(uid, pushId, data) {
  let collectionRef = firestore.collection(
    `users/${uid}/reviews/${pushId}/reviews`
  );
  const chunkSize = 500;
  const batches = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const batch = firestore.batch();
    const chunk = data.slice(i, i + chunkSize);

    chunk.forEach((doc) => {
      if (doc && doc.id) {
        const docRef = collectionRef.doc(doc.id);
        batch.set(docRef, doc);
      }
    });

    batches.push(batch.commit()); // store each batch commit promise
  }

  // Wait for all batches to commit sequentially
  for (const batch of batches) {
    await batch;
  }
}

module.exports = {
  firestore,
  auth,
  // bucket,
  // storage,
  batchWriteLargeArray,
};
