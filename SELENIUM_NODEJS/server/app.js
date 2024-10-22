require('dotenv').config();
const express = require('express');
const YAML = require('yamljs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { admin } = require('./config/firebase'); // Import Firebase config

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   console.log('Token:', token);

//   if (token) {
//     admin
//       .auth()
//       .verifyIdToken(token)
//       .then((decodedToken) => {
//         req.user = decodedToken;
//         next();
//       })
//       .catch(() => res.status(401).json({ message: 'Unauthorized' }));
//   } else {
//     next();
//   }
// });

// User routes
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/review');
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
