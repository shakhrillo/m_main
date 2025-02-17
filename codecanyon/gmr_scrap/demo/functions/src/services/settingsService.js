const admin = require("firebase-admin");

/**
 * Get setting value by tag and type.
 * @param {string} tag - The setting tag.
 * @param {string} type - The setting type.
 * @returns {Promise<number | null>} - The setting value or null if not found.
 */
const settingsService = async (tag, type) => {
  try {
    const db = admin.firestore();
    const collectionRef = db.collection("settings").where("type", "==", type).where("tag", "==", tag);
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return Number(data.value) || 0;
  } catch (error) {
    console.error("Error getting setting:", error);
    throw new Error("Failed to retrieve setting value");
  }
};

module.exports = settingsService;
