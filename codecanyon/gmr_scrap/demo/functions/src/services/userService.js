const admin = require("firebase-admin");

/**
 * Update user
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<void>}
 */
const updateUser = (uid, data) => {
  try {
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    
    return userRef.set(data, { merge: true });
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

module.exports = updateUser;