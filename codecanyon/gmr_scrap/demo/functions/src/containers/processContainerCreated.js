const admin = require("firebase-admin");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");
const { executeScraping } = require("../services/mainService");
const updateStatistics = require("../services/statisticsService");
1;

/**
 * Once a review is created, this function will be triggered.
 * - Update statistics
 * - Create container
 * - Execute scraping
 *
 * @param {functions.EventContext} event
 * @returns {Promise<void>}
 */
async function processContainerCreated(event) {
  try {
    const ref = event.data.ref;
    const data = event.data.data();
    const { containerId } = event.params;
    const { type, uid } = data;

    const tag = [type, uid, containerId].join("_").toLowerCase();
    const createdAt = Timestamp.now();
    const updatedAt = createdAt;

    console.log("processContainerCreated", {
      ref,
      data,
      containerId,
      tag,
      createdAt,
      updatedAt,
    });

    const db = admin.firestore();
    const batch = db.batch();

    /*-------------------*/
    /* Update statistics */
    /*-------------------*/
    await updateStatistics(db, batch, type, data);
    // const statisticsCollection = db.collection("statistics");
    // const statisticsQuery = await statisticsCollection
    //   .where("type", "==", type)
    //   .get();
    // let statisticsDoc;
    // if (statisticsQuery.empty) {
    //   statisticsDoc = statisticsCollection.doc(type);
    //   batch.set(statisticsDoc, {
    //     type,
    //     total: 0,
    //   });
    // } else {
    //   statisticsDoc = statisticsQuery.docs[0].ref;
    // }

    // batch.update(statisticsDoc, {
    //   total: FieldValue.increment(1),
    // });

    /*-------------------*/
    /* Create container  */
    /*-------------------*/
    batch.set(ref, {
      ...data,
      containerId,
      status: "pending",
      tag,
      createdAt,
      updatedAt,
    });

    await batch.commit();

    /*-------------------*/
    /* Execute scraping  */
    /*-------------------*/
    await executeScraping({
      tag: containerId,
      type,
    });
  } catch (error) {
    console.error("processContainerCreated", error);
  }
}

module.exports = processContainerCreated;
