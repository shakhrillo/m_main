const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  projectId: "fir-scrapp",
});

const firestore = admin.firestore();
firestore.settings({
  host: "host.docker.internal:9100",
  // host: "localhost:9100",
  ssl: false,
});

const auth = admin.auth();

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
