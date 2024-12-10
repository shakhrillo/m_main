const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

const watchMachine = async (event) => {
  const machineId = event.params.machineId;
  const previousDocument = event.data.before.data();
  const document = event.data.after.data();
  const stats = document.stats;

  const userId = document.userId;
  const reviewId = document.reviewId;
  const status = document.status;
  const totalReviews = document.totalReviews || 0;

  const totalImages = document.totalImages || 0;
  const totalOwnerReviews = document.totalOwnerReviews || 0;
  const totalUserReviews = document.totalUserReviews || 0;

  if (status === "destroy") {
    console.log(`totalReviews: ${totalReviews}`);
    console.log(`totalImages: ${totalImages}`);
    console.log(`totalOwnerReviews: ${totalOwnerReviews}`);
    console.log(`totalUserReviews: ${totalUserReviews}`);

    const docRef = admin.firestore().doc(`app/info`);
    try {
      await docRef.update({
        extractedReviews: FieldValue.increment(1),
        totalReviews: FieldValue.increment(totalReviews),
        totalImages: FieldValue.increment(totalImages),
        totalOwnerReviews: FieldValue.increment(totalOwnerReviews),
        totalUserReviews: FieldValue.increment(totalUserReviews),
      });
    } catch (error) {
      const doc = await docRef.get();
      if (!doc.exists) {
        await docRef.set({
          extractedReviews: 1, // Starting count
          totalReviews: totalReviews, // Initial value
          totalImages: totalImages, // Initial value
          totalOwnerReviews: totalOwnerReviews, // Initial value
          totalUserReviews: totalUserReviews, // Initial value
        });
      }
    }
  }

  if (stats) {
    await admin
      .firestore()
      .collection(`machines/${machineId}/stats`)
      .add({
        ...document.stats,
        createdAt: +Date.now(),
      });
  }

  if (machineId.includes("info")) {
    await admin
      .firestore()
      .doc(`users/${userId}/reviewOverview/${reviewId}`)
      .update({
        ...document,
        updatedAt: +Date.now(),
      });
  } else {
    await admin
      .firestore()
      .doc(`users/${userId}/reviews/${reviewId}`)
      .update({
        ...document,
        updatedAt: +Date.now(),
      });
  }

  console.log("Document updated", machineId);
};

module.exports = watchMachine;
