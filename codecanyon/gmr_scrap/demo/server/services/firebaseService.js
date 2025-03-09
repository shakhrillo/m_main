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
    function flattenObject(obj, prefix = '') {
      let result = {};
    
      for (let key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          let newKey = prefix ? `${prefix}.${key}` : key;
    
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(result, flattenObject(obj[key], newKey));
          } else {
            result[newKey] = obj[key];
          }
        }
      }
    
      return result;
    }

    const flatData = flattenObject(data);

    await db.collection("machines").doc(docId).set({
      ...flatData,
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

/**
 * Get user data
 * @param {string} userId
 * @returns {Promise<Object>}
 * @throws {Error}
 */
async function getUserData(userId) {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    return userDoc.data();
  } catch (error) {
    console.error("Error getting user data:", error);
  }
}

/**
 * Add payments to payments collection
 * @param {Object} data
 */
async function addPayments(data) {
  try {
    const paymentsRef = db.collection("payments");
    const id = paymentsRef.doc().id;
    await paymentsRef.doc(id).set({
      ...data,
      key: [id, data.id],
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding receipt:", error);
  }
}

module.exports = {
  updateMachine,
  addMachineStats,
  updateMachineHistory,
  addMachineLogs,
  getUserData,
  addPayments,
};
