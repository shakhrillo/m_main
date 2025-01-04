const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

async function processContainerUpdated(event) {
  // const containerId = event.params.containerId;
  // const [type] = containerId.split("_");
  const data = event.data.after.data();
  const userId = data.userId;
  const reviewId = data.reviewId;
  const documentPath = `users/${userId}/reviews/${reviewId}`;
  const createdAt = Timestamp.now();
  const updatedAt = Timestamp.now();

  const docRef = admin.firestore().doc(documentPath);
  await docRef.update({
    ...data,
    createdAt,
    updatedAt,
  });
}

module.exports = processContainerUpdated;
