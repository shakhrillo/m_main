// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err : {} // Show stack trace only in development
  });
};

module.exports = errorHandler;
