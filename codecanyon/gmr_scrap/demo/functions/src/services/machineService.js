const admin = require("firebase-admin");

/**
 * Update container
 * @param {string} machineId
 * @param {Object} data
 * @returns {Promise<void>}
 */
const updateContainer = async (machineId, data) => {
  try {
    const db = admin.firestore();
    const container = db.collection("containers").doc(machineId);

    await container.set(data, { merge: true });
  } catch (error) {
    console.error("Error updating container:", error);
  }
};

module.exports = updateContainer;