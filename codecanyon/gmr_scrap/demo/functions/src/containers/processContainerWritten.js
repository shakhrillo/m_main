const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

async function processContainerWritten(event) {
  const data = event.data;
  let beforeData;
  let afterData;

  if (data.before.exists) {
    beforeData = data.before.data();
  }

  if (data.after.exists) {
    afterData = data.after.data();
  }

  let eventType = "update";
  if (!beforeData) {
    eventType = "create";
  } else if (!afterData) {
    eventType = "delete";
  }

  if (eventType === "delete" || !afterData) {
    console.log("No further action required.");
    return;
  }

  const userId = afterData.userId;
  const reviewId = afterData.reviewId;
  const documentPath = `users/${userId}/reviews/${reviewId}`;
  const createdAt = Timestamp.now();
  const updatedAt = Timestamp.now();

  const db = admin.firestore();
  const docRef = db.doc(documentPath);

  const batch = db.batch();

  // Update review document
  batch.update(
    docRef,
    {
      ...afterData,
      createdAt,
      updatedAt,
    },
    { merge: true }
  );

  // Commit the batch
  await batch.commit();

  console.log("Firestore batch update completed successfully.");
}

module.exports = processContainerWritten;
