const admin = require("firebase-admin");

async function processSettingsWritten(event) {
  try {
    const db = admin.firestore();

    const data = event.data.after.data();
    const type = data.type;
    const { settingsId } = event.params;

    console.log("Processing settings written", data);

    if (type !== "coin") return;

    const review = Number(data.review || 1);
    const image = Number(data.image || 2);
    const video = Number(data.video || 3);
    const response = Number(data.response || 1);
    const validate = Number(data.validate || 3);

    const scrapPricesRef = db.collection("prices").doc("scrap");
    await scrapPricesRef.set({
      review,
      image,
      video,
      response,
      validate,
    });
  } catch (error) {
    console.error("Error processing container created:", error);
  }
}

module.exports = processSettingsWritten;
