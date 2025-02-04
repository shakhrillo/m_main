const fs = require('fs');
const path = require('path');

// Set the log file path
// const logFilePath = path.join(__dirname, '../logs/app.log');

// Create logs directory if it doesn't exist
// if (!fs.existsSync(path.dirname(logFilePath))) {
//   fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
// }

// Logger function
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level}]: ${message}\n`;

  // Print to console
  // console.log(logMessage);

  // Append to log file
  // fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

// Export logger functions
module.exports = {
  info: (msg) => log(msg, 'INFO'),
  warn: (msg) => log(msg, 'WARN'),
  error: (msg) => log(msg, 'ERROR'),
};
