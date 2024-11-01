const {firestore} = require('../services/firebaseAdmin');

const createReview = async (uid, review) => {
  const reviewsRef = firestore.collection(`users/${uid}/reviews`);

  return reviewsRef.add(review);
}

const updateReview = async (uid, reviewId, review) => {
  const reviewsRef = firestore.collection(`users/${uid}/reviews`);

  return reviewsRef.doc(reviewId).update(review);
}

async function batchWriteLargeArray(uid, pushId, data) {
  let collectionRef = firestore.collection(`users/${uid}/reviews/${pushId}/reviews`);
  const batch = firestore.batch();
  const chunkSize = 500;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    chunk.forEach((doc) => {
      const docRef = collectionRef.doc(doc.id);
      batch.set(docRef, doc);
    });

    await batch.commit();
  }
}

module.exports = {
  createReview,
  updateReview,
  batchWriteLargeArray
};