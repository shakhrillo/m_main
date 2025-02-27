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

/**
 * Delete user
 * @param {string} uid
 * @returns {Promise<void>}
 */
const deleteUser = (uid) => {
  try {
    const auth = admin.auth();
    return auth.deleteUser(uid);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

module.exports = {
  updateUser,
  deleteUser
}