const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "";

const createToken = (payload) =>
  jwt.sign(payload, secretKey, payload.exp ? {} : { expiresIn: "1h" });

module.exports = { createToken };
