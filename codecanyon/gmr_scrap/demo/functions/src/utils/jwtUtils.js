const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "";

function createToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "12h" });
}

module.exports = {
  createToken,
};
