const jwt = require("jsonwebtoken");

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "rmrs_!@_123", {
    expiresIn: "1h",
  });

module.exports = { createToken };
