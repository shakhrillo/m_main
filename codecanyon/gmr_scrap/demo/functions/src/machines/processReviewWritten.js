const axios = require("../utils/axiosClient");
const admin = require("firebase-admin");
const { createToken } = require("../utils/jwtUtils");
const { Timestamp } = require("firebase-admin/firestore");

async function processReviewSummaryCreated(event) {
  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const userId = event.params.userId;
  const reviewId = event.params.reviewId;
  const summaryId = event.params.summaryId;
  const tag = `info_${userId}_${reviewId}_${summaryId}`.toLowerCase();
  const createdAt = Timestamp.now();
  const updatedAt = Timestamp.now();
  const data = snapshot.data();

  await admin
    .firestore()
    .collection("containers")
    .doc(tag)
    .set({
      ...data,
      userId,
      reviewId,
      summaryId,
      createdAt,
      updatedAt,
    });

  const token = createToken({
    tag,
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const config = {
    headers,
  };

  await axios.post(`/scrap/info`, {}, config);
}

module.exports = processReviewSummaryCreated;
