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

const addMessageToReview = async (userId, uniqueId, message) => {
  try {
    const collectionRef = firestore.collection(`users/${userId}/reviews/${uniqueId}/messages`);
    await collectionRef.add(message);
  } catch (error) {
    console.error("Error adding message: ", error);
  }
};

module.exports = {
  updateReviewStatus,
  addMessageToReview
};