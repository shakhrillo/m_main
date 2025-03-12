const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using JWT.
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {Function} next - Express Next function
 */
module.exports = function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader && authorizationHeader.split(" ")[1];

  if (!token) {
    const message = "No token provided";
    return res.status(403).json({ message });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decodedData) => {
    if (error) {
      const message = "Failed to authenticate token";
      return res.status(403).json({ message });
    }
    req.machine = decodedData;
    next();
  });
};
