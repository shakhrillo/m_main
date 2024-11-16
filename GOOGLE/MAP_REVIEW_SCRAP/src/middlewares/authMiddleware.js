require("dotenv").config();
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (!token) {
    const message = "No token provided";
    logger.error(message);
    return res.status(403).json({ message });
  }

  jwt.verify(token, SECRET_KEY, (error, decodedData) => {
    if (error) {
      logger.error(error);
      const message = "Failed to authenticate token";
      logger.error(message);
      return res.status(403).json({ message });
    }
    req.data = decodedData;
    next();
  });
};
