// server.js
require('dotenv').config();

const app = require('./app'); // Import the app from app.js
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
