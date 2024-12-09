const admin = require("firebase-admin");

const watchMachine = async (event) => {
  const machineId = event.params.machineId;
  const previousDocument = event.data.before.data();
  const document = event.data.after.data();
  const stats = document.stats;

  const userId = document.userId;
  const reviewId = document.reviewId;

  if (stats) {
    await admin
      .firestore()
      .collection(`machines/${machineId}/stats`)
      .add({
        ...document.stats,
        createdAt: Date.now(),
      });
  }

  if (machineId.includes("info")) {
    await admin
      .firestore()
      .doc(`users/${userId}/reviewOverview/${reviewId}`)
      .update({
        ...document,
        updatedAt: Date.now(),
      });
  } else {
    await admin
      .firestore()
      .doc(`users/${userId}/reviews/${reviewId}`)
      .update({
        ...document,
        updatedAt: Date.now(),
      });
  }

  console.log("Document updated", machineId);
};

module.exports = watchMachine;
