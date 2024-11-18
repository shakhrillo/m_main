const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

// Ensure logs directory exists
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log level based on environment
const logLevel = process.env.LOG_LEVEL || "info";
const isProduction = process.env.NODE_ENV === "production_";

// Custom log formats
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }), // Log stack traces
  format.printf(({ timestamp, level, message, stack }) =>
    stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

const consoleFormat = format.combine(
  format.colorize(), // Add colors for console output
  format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
  )
);

// Create logger instance
const logger = createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // File for error logs
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: format.json(), // JSON format for better machine parsing
    }),
    // General application logs
    new transports.File({
      filename: path.join(logDir, "app.log"),
      format: format.json(),
    }),
  ],
});

// Add console logging for non-production environments
if (!isProduction) {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    })
  );
}

module.exports = logger;
