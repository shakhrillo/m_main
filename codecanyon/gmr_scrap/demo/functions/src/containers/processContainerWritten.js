const admin = require("firebase-admin");
const { Timestamp, GeoPoint } = require("firebase-admin/firestore");

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
  const status = afterData.status;
  const extendedUrl = afterData.extendedUrl;
  let location = "";
  const documentPath = `users/${userId}/reviews/${reviewId}`;
  const updatedAt = Timestamp.now();

  const db = admin.firestore();
  const docRef = db.doc(documentPath);

  const batch = db.batch();

  if (status === "completed") {
    for (const path of [
      "settings/statistics",
      `users/${userId}/settings/statistics`,
    ]) {
      const settingsStatisticsRef = db.doc(path);
      const settingsStatisticsSnap = await settingsStatisticsRef.get();
      const settingsStatistics = settingsStatisticsSnap.data() || {
        totalReviews: 0,
        totalReviewsScraped: 0,
        totalImages: 0,
        totalVideos: 0,
        totalUserReviews: 0,
        totalOwnerReviews: 0,
      };

      let totalReviews =
        settingsStatistics.totalReviews + afterData.totalReviews;
      let totalReviewsScraped =
        settingsStatistics.totalReviewsScrape + afterData.totalReviewsScraped;
      let totalImages = settingsStatistics.totalImages + afterData.totalImages;
      let totalVideos = settingsStatistics.totalVideos + afterData.totalVideos;
      let totalUserReviews =
        settingsStatistics.totalUserReviews + afterData.totalUserReviews;
      let totalOwnerReviews =
        settingsStatistics.totalOwnerReviews + afterData.totalOwnerReviews;

      // Update statistics document
      batch.set(settingsStatisticsRef, {
        totalReviews,
        totalReviewsScraped,
        totalImages,
        totalVideos,
        totalUserReviews,
        totalOwnerReviews,
      });
    }

    const matches = extendedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (matches) {
      const lat = matches[1];
      const lng = matches[2];
      location = new GeoPoint(parseFloat(lat), parseFloat(lng));
    }

    const settingsPricesRef = db.doc("settings/prices");
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
    const userRef = db.doc(`users/${userId}`);
    const userSnap = await userRef.get();
    const user = userSnap.data();
    const currentBalance = user?.coinBalance || 0;
    let newBalance = currentBalance;

    const commentPrice = settingsPrices.prices.comment || 1;
    newBalance = currentBalance - commentPrice * afterData.totalReviews;

    const imagePrice = settingsPrices.prices.image || 2;
    newBalance = newBalance - imagePrice * afterData.totalImages;

    const videoPrice = settingsPrices.prices.video || 3;
    newBalance = newBalance - videoPrice * afterData.totalVideos;

    const responsePrice = settingsPrices.prices.response || 1;
    newBalance = newBalance - responsePrice * afterData.totalOwnerReviews;

    if (newBalance < 0) {
      console.log("Insufficient balance.");
      // return;
    }

    // Update user document
    batch.update(userRef, {
      coinBalance: newBalance,
    });
  }

  // Update review document
  batch.update(
    docRef,
    {
      ...afterData,
      location,
      updatedAt,
    },
    { merge: true }
  );

  // Commit the batch
  await batch.commit();

  console.log("Firestore batch update completed successfully.");
}

module.exports = processContainerWritten;
