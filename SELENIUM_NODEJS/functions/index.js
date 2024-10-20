const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.trackReviewCount = functions.firestore
  .document('reviews/{userId}/userReviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const statisticsUserRef = admin.firestore().doc(`statistics/users/${context.params.userId}`);
    
    try {
      await admin.firestore().runTransaction(async transaction => {
        const userSnapshot = await transaction.get(statisticsUserRef);
        const newReviewCount = userSnapshot.data().reviewCount + 1;
        transaction.update(statisticsUserRef, { reviewCount: newReviewCount });
      });
    }
    catch (error) {
      console.log('Transaction failed:', error);
    }
  });

exports.trackReviewCount = functions.firestore
  .document('reviews/{userId}/userReviews/{reviewId}')
  .onDelete(async (snap, context) => {
    const statisticsUserRef = admin.firestore().doc(`statistics/users/${context.params.userId}`);
    
    try {
      await admin.firestore().runTransaction(async transaction => {
        const userSnapshot = await transaction.get(statisticsUserRef);
        const newReviewCount = userSnapshot.data().reviewCount - 1;
        transaction.update(statisticsUserRef, { reviewCount: newReviewCount });
      });
    }
    catch (error) {
      console.log('Transaction failed:', error);
    }
  });