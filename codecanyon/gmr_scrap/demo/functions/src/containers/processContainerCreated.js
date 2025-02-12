const admin = require("firebase-admin");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");
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
    let review = 1;
    let image = 2;
    let video = 3;
    let response = 1;
    let validate = 3;

    // User balance
    // const usersCollection = admin.firestore().collection("users").where("uid", "==", uid);
    // const usersQuery = await usersCollection.get();
    // if (!usersQuery.empty) {
    //   const user = usersQuery.docs[0].data();
    //   limit = user["coinBalance"] || limit;
    // }

    // Container price
    const settingsPricesCollection = admin
      .firestore()
      .collection("settings")
      .where("type", "==", "prices");
    const settingsPricesQuery = await settingsPricesCollection.get();
    if (!settingsPricesQuery.empty) {
      const settingsPrices = settingsPricesQuery.docs.map((doc) => doc.data());
      // console.log("settingsPrices", settingsPrices);
      for (const settingsPrice of settingsPrices) {
        const price = settingsPrice["price"];
        const label = settingsPrice["label"];

        switch (label) {
          case "validate":
            validate = price || validate;
            break;
          case "review":
            review = price || review;
            break;
          case "image":
            image = price || image;
            break;
          case "video":
            video = price || video;
            break;
          case "response":
            response = price || response;
            break;
        }
      }
    }

    const tag = [type, uid, containerId].join("_").toLowerCase();
    const createdAt = Timestamp.now();
    const updatedAt = createdAt;

    const db = admin.firestore();

    const batch = db.batch();

    /*-------------------*/
    /* Update statistics */
    /*-------------------*/
    // await updateStatistics(db, batch, type, data);
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
    batch.update(ref, {
      ...data,
      containerId,
      status: "pending",
      tag,
      createdAt,
      updatedAt,
      price: {
        review,
        image,
        video,
        response,
        validate,
      },
    });

    // console.log("processContainerCreated", {
    //   ...data,
    //   containerId,
    //   status: "pending",
    //   tag,
    //   createdAt,
    //   updatedAt,
    // });

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
