const { Timestamp } = require("firebase-admin/firestore");
const { executeScraping } = require("../services/mainService");
const updateStatistics = require("../services/statisticsService");

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

    console.log("processContainerCreated", {
      containerId,
      type,
      uid,
    });

    const tag = [type, uid, containerId].join("_").toLowerCase();
    const createdAt = Timestamp.now();
    const updatedAt = createdAt;

    /*-------------------*/
    /* Create container  */
    /*-------------------*/
    ref.update({
      ...data,
      containerId,
      status: "pending",
      tag,
      createdAt,
      updatedAt,
    });

    /*-------------------*/
    /* Execute scraping  */
    /*-------------------*/
    await executeScraping({
      tag: containerId,
      type,
    });

    /*-------------------*/
    /* Update statistics */
    /*-------------------*/
    await updateStatistics(type);
    
  } catch (error) {
    console.error("processContainerCreated", error);
  }
}

module.exports = processContainerCreated;
