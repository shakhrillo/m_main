const errorHandler = (err, req, res, next) => {
  console.error(`${req.method} ${req.url} - ${err.message}`);
  res.status(500).json({ error: "Something went wrong!" });
};

module.exports = errorHandler;
