const { db } = require("../firebase");
const { Timestamp } = require("firebase-admin/firestore");

/**
 * Update machine data
 * @param {string} docId
 * @param {Object} data
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function updateMachine(docId, data) {
  try {
    await db.collection("machines").doc(docId).set({
      ...data,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error("Error updating machine:", error);
  }
}

/**
 * Add image history to machine history collection
 * @param {string} docId
 * @param {Docker.ImageInspectInfo} imgHistory
 */
async function updateMachineHistory(docId, imgHistory) {
  if (!imgHistory) return;

  try {
    const batch = db.batch();
    const historyCollection = db.collection("machines").doc(docId).collection("history");

    imgHistory.forEach((history) => {
      const historyRef = historyCollection.doc(history.Id);
      batch.set(historyRef, {
        ...history,
        updatedAt: Timestamp.now(),
      }, { merge: true });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error updating machine history:", error);
  }
}

/**
 * Add machine stats to machine stats collection
 * @param {string} docId
 * @param {Object} stats
 */
async function addMachineStats(docId, stats) {
  try {
    await db.collection("machines").doc(docId).collection("stats").add({
      ...stats,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating machine stats:", error);
  }
}

/**
 * Add logs to machine logs collection
 * @param {string} docId
 * @param {string} logs
 */
async function addMachineLogs(docId, logs) {
  try {
    await db.collection("machines").doc(docId).collection("logs").add({
      logs,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating machine logs:", error);
  }
}

module.exports = {
  updateMachine,
  addMachineStats,
  updateMachineHistory,
  addMachineLogs,
};
