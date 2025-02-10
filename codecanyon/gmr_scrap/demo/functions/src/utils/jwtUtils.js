const jwt = require("jsonwebtoken");

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

module.exports = { createToken };
