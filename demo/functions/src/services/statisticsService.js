const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

/**
 * Update statistics
 * @param {string} type
 * @param {number} value
 * @returns {Promise<void>}
 */
const updateStatistics = async (type, value) => {
  try {
    const db = admin.firestore();
    const statisticsRef = db.doc(`statistics/${type}`);
    await statisticsRef.update({
      total: FieldValue.increment(value || 1),
    });
  } catch (error) {
    console.error("Error updating statistics:", error);
  }
};

module.exports = updateStatistics;
