const firestore = require('../firebase/main').firestore;

const updateReviewStatus = async (userId, uniqueId, data) => {
  try {
    const docRef = firestore.doc(`users/${userId}/reviews/${uniqueId}`);
    await docRef.update(data);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

module.exports = {
  updateReviewStatus,
};