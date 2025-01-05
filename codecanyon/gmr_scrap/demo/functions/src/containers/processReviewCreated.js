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
  const userRef = db.doc(`users/${userId}`);
  const settingsPricesRef = db.doc("settings/prices");

  // Fetch necessary data
  const settingsPricesSnap = await settingsPricesRef.get();
  const settingsPrices = settingsPricesSnap.data() || {
    prices: {
      image: 2,
      video: 3,
      response: 1,
      review: 1,
      validation: 3,
    },
  };

  const userSnap = await userRef.get();
  const user = userSnap.data();
  const currentBalance = user?.coinBalance || 0;
  let newBalance = currentBalance;

  if (type === "comments") {
    const commentPrice = settingsPrices.prices.comment || 1;
    newBalance = currentBalance - commentPrice * limit;

    if (extractImageUrls) {
      const imagePrice = settingsPrices.prices.image || 2;
      newBalance = newBalance - imagePrice * limit;
    }

    if (extractVideoUrls) {
      const videoPrice = settingsPrices.prices.video || 3;
      newBalance = newBalance - videoPrice * limit;
    }

    if (ownerResponse) {
      const responsePrice = settingsPrices.prices.response || 1;
      newBalance = newBalance - responsePrice * limit;
    }

    // if (newBalance < 0) {
    //   console.log("Insufficient balance.");
    //   return;
    // }
  } else if (type === "info") {
    const validationPrice = settingsPrices.prices.validation || 1;
    newBalance = currentBalance - validationPrice;

    // if (newBalance < 0) {
    //   console.log("Insufficient balance.");
    //   return;
    // }
  }

  const batch = db.batch();

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

  // Update user balance
  batch.update(userRef, {
    coinBalance: newBalance,
  });

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
