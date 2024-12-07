const { db } = require("../firebase");

async function updateMachine(docId, data) {
  try {
    await db.collection("machines").doc(docId).update(data);
  } catch (error) {
    console.error("Error updating machine:", error);
  }
}

module.exports = {
  updateMachine,
};
