require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "";

function createToken(payload) {
  console.log("secretKey:", secretKey);
  return jwt.sign(payload, secretKey, { expiresIn: "12h" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded; // If valid, returns the decoded payload
  } catch (err) {
    // Handle errors (e.g., token expired or invalid)
    console.error("Invalid token:", err.message);
    return null;
  }
}

(async () => {
  const token = createToken({
    url: "https://maps.app.goo.gl/5uNP3xReQvj9FN7p7",
    reviewId: "xJuwdTi7mbb5lPWbj5sF",
    userId: "83gDir7H21dnNXyk06BvGHN13v72",
    limit: 30,
    sortBy: "Newest",
  });
  // console.log('Token:', token);
  console.log("--".repeat(20));
  console.log(token);
  console.log("--".repeat(20));
  const decoded = verifyToken(token);
  console.log("Decoded:", decoded);
})();
