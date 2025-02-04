// middlewares/logger.js

const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Proceed to the next middleware or route handler
};

module.exports = logger;
