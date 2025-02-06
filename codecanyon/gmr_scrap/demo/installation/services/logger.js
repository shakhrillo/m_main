/**
 * @fileoverview Logger service.
 * This service provides logging functionality for the script.
 */

// Dependencies
const ora = require("ora");
let startTime = Date.now();
let endTime = Date.now();

// Constants
const spinner = ora({
  spinner: "dots",
  color: "cyan",
});

/**
 * Log a message.
 * @param {string} message The message to log.
 */
function log(message) {
  if (!spinner.isSpinning || !message || typeof message !== "string") {
    return;
  }

  try {
    const seconds = (Date.now() - startTime) / 1000;
    const formattedMessage = `\u001b[1m[Elapsed ${Math.round(
      seconds
    )}s]\u001b[0m ${message.replace(/\n/g, " ")}`;

    spinner.text = formattedMessage;
  } catch (err) {
    console.error(err);
  }
}

function startLog() {
  if (spinner.isSpinning) {
    return;
  }

  startTime = Date.now();
  spinner.start();
}

function stopLog() {
  if (!spinner.isSpinning) {
    return;
  }

  endTime = Date.now();
  spinner.stop();
}

module.exports = {
  log,
  startLog,
  stopLog,
};
