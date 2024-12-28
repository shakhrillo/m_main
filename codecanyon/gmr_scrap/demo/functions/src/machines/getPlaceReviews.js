const admin = require("firebase-admin");
const axios = require("axios");
const { createToken } = require("../utils/jwtUtils");

const getPlaceReview = async (event) => {
  const endpointURL = `http://${
    process.env.SERVER_IP || "host.docker.internal"
  }:${process.env.SERVER_PORT || 1337}`;

  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const userId = event.params.userId;
  const reviewId = event.params.reviewId;
  const tag = `comments_${userId}_${reviewId}`.toLowerCase();

  await admin
    .firestore()
    .collection("machines")
    .doc(tag)
    .set({
      ...snapshot.data(),
      userId,
      reviewId,
      createdAt: +new Date(),
    });

  const token = createToken({
    tag,
  });

  await axios.post(
    `${endpointURL}/scrap`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

module.exports = getPlaceReview;
