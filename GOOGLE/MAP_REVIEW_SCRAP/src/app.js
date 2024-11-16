const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const reviewsRoutes = require("./routes/reviewsRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./config/logger");
const authMiddleware = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(authMiddleware);

// Routes
app.use("/api/reviews", reviewsRoutes);
app.use("/api/stripe", stripeRoutes);

// Default route
app.get("/", (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  res.send(`
    <h1>${process.env.APP_NAME}</h1>
    <p>The server has been running for:</p>
    <p><strong>${hours}h ${minutes}m ${seconds}s</strong></p>
  `);
});

app.use((req, res, next) => {
  const error = new Error("Invalid route");
  error.status = 404;
  next(error);
});

// Error-handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
