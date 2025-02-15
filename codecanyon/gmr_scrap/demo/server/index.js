require("dotenv").config();
const express = require("express");
const cors = require("cors");
const scraperRoutes = require("./routes/scraperRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const errorHandler = require("./middlewares/errorHandler");
const { watchDockerEvents } = require("./docker");

const app = express();
const PORT = process.env.APP_SERVER_PORT;

// Middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/stripe", stripeRoutes);

app.use(express.json());
app.use("/scrap", scraperRoutes);

// Default route
app.get("/", (req, res) => res.send("Server is running"));

app.use((req, res, next) => {
  const error = new Error("Invalid route");
  error.status = 404;
  next(error);
});

// Error-handling middleware
app.use(errorHandler);

// Watch Docker events
(async () => await watchDockerEvents())();

// Start the server
app.listen(PORT, () => {
  console.log("-".repeat(50));
  console.log("");
  console.log(
    "\x1b[1m\x1b[32m%s\x1b[0m",
    `\u2713 GMR Scrap Server [${process.env.APP_ENVIRONMENT}]`
  );
  console.log(
    "\x1b[1m\x1b[32m%s\x1b[0m",
    `\u2713 Server is running on port [:${PORT}]`
  );
  console.log("");
  console.log("-".repeat(50));
});
