require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "";

function createToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "12h" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, "secretKey");
    return decoded; // If valid, returns the decoded payload
  } catch (err) {
    // Handle errors (e.g., token expired or invalid)
    console.error("Invalid token:", err.message);
    return null;
  }
}

(async () => {
  const token = createToken({
    url: "https://maps.app.goo.gl/EcFVGT1UvmCQy7di9",
    reviewId: "Q4vNEoTkpOtdvgEmCe02",
    userId: "MHKWy9QpFjfijMlKxeimUyOPYLt1",
    limit: 50,
    sortBy: "Newest",
  });
  // console.log('Token:', token);
  console.log("--".repeat(20));
  console.log(token);
  console.log("--".repeat(20));
  const decoded = verifyToken(token);
  console.log("Decoded:", decoded);
})();
