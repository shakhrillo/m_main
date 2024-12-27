const axios = require("axios");
const admin = require("firebase-admin");
const { createToken } = require("../utils/jwtUtils");

const getPlaceOverview = async (event) => {
  const isEmulator = process.env.FUNCTIONS_EMULATOR;
  const endpointURL = process.env.ENDPOINT_URL;

  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const userId = event.params.userId;
  const reviewId = event.params.reviewId;
  const tag = `info_${userId}_${reviewId}`.toLowerCase();

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
    `${endpointURL}/scrap/info`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

module.exports = getPlaceOverview;
