const axios = require("../utils/axiosClient");
const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");
const { createToken } = require("../utils/jwtUtils");

async function processReviewCreated(event) {
  const snapshot = event.data;
  const data = snapshot.data();
  const userId = event.params.userId;
  const reviewId = event.params.reviewId;
  const type = data.type;
  const limit = data.limit;
  const extractImageUrls = data.extractImageUrls;
  const extractVideoUrls = data.extractVideoUrls;
  const ownerResponse = data.ownerResponse;
  const tag = `${type}_${userId}_${reviewId}`.toLowerCase();
  const createdAt = Timestamp.now();
  const updatedAt = Timestamp.now();

  const db = admin.firestore();
  const containerRef = db.doc(`containers/${tag}`);

  const batch = db.batch();
  const statisticsRef = db.doc(`statistics/${type}`);

  if (statisticsRef && statisticsRef.exists) {
    batch.update(statisticsRef, {
      total: admin.firestore.FieldValue.increment(1),
    });
  } else {
    batch.set(statisticsRef, {
      total: 1,
    });
  }

  // Update review document
  batch.set(
    containerRef,
    {
      ...data,
      userId,
      reviewId,
      createdAt,
      updatedAt,
    },
    { merge: true }
  );

  // Commit the batch
  await batch.commit();

  const token = createToken({
    tag,
    type,
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers,
  };

  await axios.post(`/scrap`, {}, config);
}

module.exports = processReviewCreated;
