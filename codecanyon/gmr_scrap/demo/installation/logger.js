/**
 * @fileoverview Logger service.
 * This service provides logging functionality for the script.
 */

// Dependencies
const fs = require("fs");
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
  if (!spinner.isSpinning || !message) {
    return;
  }

  if (typeof message !== "string" && message instanceof Buffer) {
    const buffer = Buffer.from(message);
    message = buffer.toString("utf8");
  } else if (typeof message !== "string") {
    message = JSON.stringify(message);
  }

  try {
    const seconds = (Date.now() - startTime) / 1000;
    const formattedMessage = `\u001b[1m[Elapsed ${Math.round(
      seconds
    )}s]\u001b[0m ${message.replace(/\n/g, " ")}`;

    spinner.text = formattedMessage;
  } catch (err) {
    console.error(err);
  } finally {
    fs.appendFileSync("install.log", message + "\n");
  }
}

function startLog() {
  if (spinner.isSpinning) {
    return;
  }

  console.log(
    "\u001b[1m\u001b[35mGMRS: Building Docker containers...\u001b[0m"
  );

  startTime = Date.now();
  spinner.start();
}

function stopLog() {
  if (!spinner.isSpinning) {
    return;
  }

  endTime = Date.now();
  spinner.stop();
  console.log(
    `\u001b[1m\u001b[35mGMRS: Docker containers built in ${Math.round(
      (endTime - startTime) / 1000
    )}s\u001b[0m`
  );
}

module.exports = {
  log,
  startLog,
  stopLog,
};
