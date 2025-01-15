const admin = require("firebase-admin");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");
const { executeScraping } = require("../services/mainService");

/**
 * Once a review is created, this function will be triggered.
 * - Update statistics
 * - Create container
 * - Execute scraping
 *
 * @param {functions.EventContext} event
 * @returns {Promise<void>}
 */
async function processReviewCreated(event) {
  const data = event.data.data();
  const { userId, reviewId } = event.params;
  const { type } = data; // e.g. "info | comments"

  const tag = [type, userId, reviewId].join("_").toLowerCase(); // e.g. "info_123_456"
  const createdAt = Timestamp.now();
  const updatedAt = createdAt;

  const db = admin.firestore();
  const batch = db.batch();

  /*-------------------*/
  /* Update statistics */
  /*-------------------*/
  const statisticsRef = db.doc(`statistics/${type}`);
  batch.update(statisticsRef, {
    total: FieldValue.increment(1),
  });

  /*-------------------*/
  /* Create container  */
  /*-------------------*/
  const containerRef = db.doc(`containers/${tag}`);
  batch.set(containerRef, {
    ...data,
    status: "pending",
    userId,
    reviewId,
    createdAt,
    updatedAt,
  });

  await batch.commit();

  /*-------------------*/
  /* Execute scraping  */
  /*-------------------*/
  await executeScraping({
    tag,
    type,
  });
}

module.exports = processReviewCreated;
