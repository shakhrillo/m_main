const { db } = require("../firebase");
const { Timestamp } = require("firebase-admin/firestore");

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
      .set(
        {
          ...data,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
  } catch (error) {
    console.error("Error updating machine:", error);
  }
}

async function updateDockerInfo(info) {
  try {
    await db
      .collection("docker")
      .doc("info")
      .set(
        { info: JSON.stringify(info), updatedAt: Timestamp.now() },
        { merge: true }
      );
  } catch (error) {
    console.error("Error saving Docker info:", error);
  }
}

async function updateDockerImageInfo(info) {
  try {
    await db
      .collection("docker")
      .doc("image")
      .set(
        { info: JSON.stringify(info), updatedAt: Timestamp.now() },
        { merge: true }
      );
  } catch (error) {
    console.error("Error saving Docker info:", error);
  }
}

module.exports = {
  createMachine,
  updateMachine,
  updateDockerInfo,
  updateDockerImageInfo,
};
