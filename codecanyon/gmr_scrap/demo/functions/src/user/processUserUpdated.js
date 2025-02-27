const { deleteUser } = require("../services/userService");

/**
 * Process user updated
 * @param {Object} event
 * @returns {Promise<void>}
 */
async function processUserUpdated(event) {
  try {
    const data = event.data.after.data();
    const { userId } = event.params;

    if (data.isDeleted === true) {
      await deleteUser(userId);
    }
  } catch (error) {
    console.error("Error processing machine written", error);
  }
}

module.exports = processUserUpdated;
