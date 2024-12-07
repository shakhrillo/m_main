const { docker, watchEvents } = require("./docker");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const machinesRoutes = require("./routes/machinesRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const errorHandler = require("./middlewares/errorHandler");
const logger = require("./config/logger");
const { db } = require("./firebase");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Middlewares
    app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
    app.use(express.urlencoded({ extended: true }));

    app.use("/api/stripe", stripeRoutes);
    app.use(express.json());

    app.use("/api/machines", machinesRoutes);
    app.use("/api/scrap", scraperRoutes);

    // Default route
    app.get("/", (req, res) => res.send("Server is running"));

    app.use((req, res, next) => {
      const error = new Error("Invalid route");
      error.status = 404;
      next(error);
    });

    // Error-handling middleware
    app.use(errorHandler);

    watchEvents();

    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error connecting to Firestore:", error);
  }
};

startServer();
