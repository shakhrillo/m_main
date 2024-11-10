const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "";

// Middleware to verify token
module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, data) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.data = data;
    next();
  });
};
