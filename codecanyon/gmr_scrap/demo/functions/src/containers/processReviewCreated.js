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
  const tag = `${type}_${userId}_${reviewId}`.toLowerCase();
  const createdAt = Timestamp.now();
  const updatedAt = Timestamp.now();

  await admin
    .firestore()
    .collection("container")
    .doc(tag)
    .set({
      ...data,
      userId,
      reviewId,
      createdAt,
      updatedAt,
    });

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
