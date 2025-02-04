const admin = require("firebase-admin");
require("dotenv").config();
const firebaseKey = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY_BASE64, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey),
  storageBucket: process.env.STORAGE_BUCKET,
});

const firestore = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

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
  bucket,
  batchWriteLargeArray,
};
