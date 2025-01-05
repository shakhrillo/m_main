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
  const createdAt = Timestamp.now();
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
  }

  // Update review document
  batch.update(
    docRef,
    {
      ...afterData,
      location,
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
