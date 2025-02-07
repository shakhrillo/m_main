/**
 * @fileoverview Logger service.
 * This service provides logging functionality for the script using log4js.
 */

// Dependencies
const fs = require("fs");
const log4js = require("log4js");

// Constants
log4js.configure({
  appenders: {
    file: { type: "file", filename: "install.log" },
    console: { type: "stdout" },
  },
  categories: {
    default: { appenders: ["file", "console"], level: "info" },
  },
});

const logger = log4js.getLogger();

// Time tracking
let startTime = Date.now();
let endTime = Date.now();

/**
 * Log a message.
 * @param {string} message The message to log.
 */
function log(message) {
  if (typeof message !== "string" && message instanceof Buffer) {
    const buffer = Buffer.from(message);
    message = buffer.toString("utf8");
  } else if (typeof message !== "string") {
    message = JSON.stringify(message);
  }

  const seconds = (Date.now() - startTime) / 1000;
  const formattedMessage = `[Elapsed ${Math.round(seconds)}s] ${message.replace(
    /\n/g,
    " "
  )}`;

  logger.info(formattedMessage); // Logs to the file and console
  fs.appendFileSync("install.log", formattedMessage + "\n"); // Append to log file manually
}

/**
 * Start the logging process.
 */
function startLog() {
  console.log(
    "\u001b[1m\u001b[35mGMRS: Building Docker containers...\u001b[0m"
  );
  startTime = Date.now();
  logger.info("Starting to build Docker containers...");
}

/**
 * Stop the logging process.
 */
function stopLog() {
  endTime = Date.now();
  const seconds = (endTime - startTime) / 1000;
  console.log(
    `\u001b[1m\u001b[35mGMRS: Docker containers built in ${Math.round(
      seconds
    )}s\u001b[0m`
  );
  logger.info(`Docker containers built in ${Math.round(seconds)}s`);
}

module.exports = {
  log,
  startLog,
  stopLog,
};
