require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

