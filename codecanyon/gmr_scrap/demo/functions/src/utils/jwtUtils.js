const jwt = require("jsonwebtoken");

const createToken = (payload) =>
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    payload.exp ? {} : { expiresIn: "1h" }
  );

module.exports = { createToken };
