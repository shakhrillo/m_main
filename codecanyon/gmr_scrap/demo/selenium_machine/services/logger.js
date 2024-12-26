/**
 * @fileoverview Logger service.
 * This service provides logging functionality for the script.
 */

// Dependencies
const ora = require("ora");

// Constants
const isTTY = process.stdout.isTTY;
const spinner = ora({
  spinner: "dots",
  color: "cyan",
});

/**
 * Log a message.
 * @param {string} message The message to log.
 */
function log(message) {
  if (isTTY) {
    if (!message) {
      if (spinner.isSpinning) {
        spinner.stop();
      }
      return;
    }

    if (!spinner.isSpinning) {
      spinner.start();
    }
    spinner.text = message;
  } else {
    console.log(message);
  }
}

module.exports = {
  log,
};
