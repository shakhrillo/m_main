const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

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
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log("Document updated", machineId);
};

module.exports = watchMachine;
