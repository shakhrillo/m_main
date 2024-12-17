const admin = require("firebase-admin");

const watchMachine = async (event) => {
  const machineId = event.params.machineId;
  const document = event.data.after.data();
  const [type] = machineId.split("_");

  console.log("document", document);
  console.log("type", type);

  const docRef = admin
    .firestore()
    .doc(
      `users/${document.userId}/${
        type.includes("info") ? "reviewOverview" : "reviews"
      }/${document.reviewId}`
    );
  await docRef.update({
    ...document,
    updatedAt: +new Date(),
  });

  console.log("Document updated", machineId);
};

module.exports = watchMachine;
