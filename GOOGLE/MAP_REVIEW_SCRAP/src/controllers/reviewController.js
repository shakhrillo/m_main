const { firestore } = require("../services/firebaseAdmin");

const createReview = async (uid, review) => {
  const reviewsRef = firestore.collection(`users/${uid}/reviews`);

  return reviewsRef.add(review);
};

const updateReview = async (uid, reviewId, review) => {
  const reviewsRef = firestore.collection(`users/${uid}/reviews`);

  return reviewsRef.doc(reviewId).update(review);
};

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
      if (doc.id) {
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
  createReview,
  updateReview,
  batchWriteLargeArray,
};
