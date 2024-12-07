const admin = require("firebase-admin");

const watchMachine = async (event) => {
  const machineId = event.params.machineId;
  const previousDocument = event.data.before.data();
  const document = event.data.after.data();

  const userId = document.userId;
  const reviewId = document.reviewId;

  if (machineId.includes("info")) {
    await admin
      .firestore()
      .doc(`users/${userId}/reviewOverview/${reviewId}`)
      .update({
        ...document,
        updatedAt: new Date(),
      });
  } else {
    await admin
      .firestore()
      .doc(`users/${userId}/reviews/${reviewId}`)
      .update({
        ...document,
        updatedAt: new Date(),
      });
  }

  console.log("Document updated", machineId);
};

module.exports = watchMachine;
