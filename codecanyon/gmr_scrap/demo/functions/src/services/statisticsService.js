const { FieldValue } = require("firebase-admin/firestore");

const updateStatistics = async (db, batch, type, data) => {
  const statisticsCollection = db.collection("statistics");
  const statisticsQuery = await statisticsCollection
    .where("type", "==", type)
    .get();
  let statisticsDoc;
  if (statisticsQuery.empty) {
    statisticsDoc = statisticsCollection.doc(type);
    batch.set(statisticsDoc, {
      type,
      total: 0,
    });
  } else {
    statisticsDoc = statisticsQuery.docs[0].ref;
  }

  batch.update(statisticsDoc, {
    total: FieldValue.increment(data[type] || 0),
  });
};

module.exports = updateStatistics;
