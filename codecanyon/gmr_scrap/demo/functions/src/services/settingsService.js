const admin = require("firebase-admin");

/**
 * Get setting value by tag and type.
 * @param {string} tag - The setting tag.
 * @param {string} type - The setting type.
 * @returns {Promise<object | null>}
 */
const settingsService = async (tag, type) => {
    const db = admin.firestore();
    const collectionRef = db.collection("settings").where("type", "==", type).where("tag", "==", tag);
    const results = await collectionRef.get();

    if (results.empty) {
        return null;
    }

    const doc = results.docs[0];
    const data = doc.data();

    return Number(data.value || 0);
};

module.exports = settingsService;
