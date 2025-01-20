const admin = require("firebase-admin");

/**
 * Once a machine is written, this function will be triggered.
 * - Update container
 * @param {functions.EventContext} event
 * @returns {Promise<void>}
 */
async function processMachineWritten(event) {
  try {
    const data = event.data.after.data();
    const { machineId } = event.params;

    const db = admin.firestore();
    const tag = data.Actor.Attributes.name;
    const container = db.collection("containers").doc(tag);

    await container.update({
      machine: data,
    });
  } catch (error) {
    console.error("Error processing machine written", error);
  }
}

module.exports = processMachineWritten;
