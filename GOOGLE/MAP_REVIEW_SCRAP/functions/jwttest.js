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
    url: "https://maps.app.goo.gl/mccerYhUvrcA8tdCA",
    reviewId: "xJuwdTi7mbb5lPWbj5sF",
    userId: "MHKWy9QpFjfijMlKxeimUyOPYLt1",
    limit: 50000,
    sortBy: "Newest",
  });
  // console.log('Token:', token);
  console.log("--".repeat(20));
  console.log(token);
  console.log("--".repeat(20));
  const decoded = verifyToken(token);
  console.log("Decoded:", decoded);
})();
