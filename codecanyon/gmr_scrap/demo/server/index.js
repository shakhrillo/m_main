const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { watchEvents } = require("./docker");
const machinesRoutes = require("./routes/machinesRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/stripe", stripeRoutes);

app.use(express.json());

app.use("/api/scrap", scraperRoutes);
app.use("/api/machines", machinesRoutes);

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
  console.log(`Server is running: http://localhost:${PORT}`);
});
