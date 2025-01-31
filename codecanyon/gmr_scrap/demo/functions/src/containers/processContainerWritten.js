require("dotenv").config();
const admin = require("firebase-admin");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");
const capitalizeText = require("../utils/capitalizeText");
const updateStatistics = require("../services/statisticsService");

/**
 * Once a container is written, this function will be triggered.
 * - Update user stats
 * - Update container
 * @param {functions.EventContext} event
 * @returns {Promise<void>}
 */
async function processContainerWritten(event) {
  const ref = event.data.after.ref;
  const data = event.data.after.data();

  const db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  const batch = db.batch();
  const userRef = db.doc(`users/${data.userId}`);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.error("User not found");
    return;
  }

  if (data.status === "completed") {
    /*-------------------*/
    /* Update user stats */
    /*-------------------*/
    const settingsPricesRef = db.doc("settings/prices");
    const settingsPricesSnap = await settingsPricesRef.get();
    const settingsPrices = settingsPricesSnap.data();

    let cost = data.totalReviews * settingsPrices.review;
    cost += data.totalImages * settingsPrices.image;
    cost += data.totalVideos * settingsPrices.video;
    cost += data.totalOwnerReviews * settingsPrices.response;

    batch.update(userRef, {
      coinBalance: FieldValue.increment(-cost || 0),
      totalReviews: FieldValue.increment(data.totalReviews || 0),
      totalImages: FieldValue.increment(data.totalImages || 0),
      totalVideos: FieldValue.increment(data.totalVideos || 0),
      totalOwnerReviews: FieldValue.increment(data.totalOwnerReviews || 0),
      [`totalValidate${capitalizeText(data.type)}`]: FieldValue.increment(1),
    });

    /*-------------------*/
    /* Update statistics */
    /*-------------------*/
    [
      `totalValidate${capitalizeText(data.type)}`,
      "totalReviews",
      "totalImages",
      "totalVideos",
      "totalOwnerReviews",
    ].forEach((type) => {
      // const statisticsRef = db.doc(`statistics/${type}`);
      // batch.update(statisticsRef, {
      //   total: FieldValue.increment(data[type] || 0),
      // });
      updateStatistics(db, batch, type, data);
    });

    // batch.update(
    //   db.doc(`statistics/totalValidate${capitalizeText(data.type)}`),
    //   {
    //     total: FieldValue.increment(1),
    //   }
    // );
  }

  /*-------------------*/
  /* Update container  */
  /*-------------------*/
  // const docRef = db.doc(`users/${data.userId}/reviews/${data.reviewId}`);
  // batch.update(docRef, {
  //   ...data,
  //   updatedAt: Timestamp.now(),
  // });
  batch.update(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error("Error updating container", error);
  }
}

module.exports = processContainerWritten;
