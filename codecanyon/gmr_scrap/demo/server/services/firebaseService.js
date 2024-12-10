const { db } = require("../firebase");

async function createMachine(docId, data) {
  try {
    await db.collection("machines").doc(docId).set(data);
  } catch (error) {
    console.error("Error creating machine:", error);
  }
}

async function updateMachine(docId, data) {
  try {
    await db
      .collection("machines")
      .doc(docId)
      .update({
        ...data,
        updatedAt: +new Date(),
      });
  } catch (error) {
    console.error("Error updating machine:", error);
  }
}

async function updateDockerImageInfo(info) {
  try {
    await db
      .collection("docker")
      .doc("image")
      .set({ info: JSON.stringify(info) }, { merge: true });
  } catch (error) {
    console.error("Error saving Docker info:", error);
  }
}

module.exports = {
  createMachine,
  updateMachine,
  updateDockerImageInfo,
};
