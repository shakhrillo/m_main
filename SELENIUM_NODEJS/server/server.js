require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT;

// clear all console form the terminal
// process.stdout.write('\x1bc');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

