const { db } = require("../firebase");

async function updateMachine(docId, data) {
  try {
    await db.collection("machines").doc(docId).update(data);
  } catch (error) {
    console.error("Error updating machine:", error);
  }
}

async function updateDockerInfo(info) {
  try {
    await db
      .collection("docker")
      .doc("info")
      .set({ info: JSON.stringify(info) }, { merge: true });
  } catch (error) {
    console.error("Error saving Docker info:", error);
  }
}

module.exports = {
  updateMachine,
  updateDockerInfo,
};
