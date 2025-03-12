const updateContainer = require("../services/machineService");

/**
 * Once a machine is written, this function will be triggered.
 * - Update container
 * @param event - Functions event
 * @returns {Promise<void>}
 */
async function processMachineWritten(event) {
  try {
    const data = event.data.after.data();
    const { machineId } = event.params;

    if (!data) {
      console.error("No data found for machineId", machineId);
      return;
    }

    await updateContainer(machineId, {
      machine: data,
      machineId,
    });
  } catch (error) {
    console.error("Error processing machine written", error);
  }
}

module.exports = processMachineWritten;
