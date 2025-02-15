require("dotenv").config();
const express = require("express");
const cors = require("cors");

const scraperRoutes = require("./routes/scraperRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const errorHandler = require("./middlewares/errorHandler");
const { watchDockerEvents } = require("./docker");

const app = express();
const PORT = process.env.APP_SERVER_PORT || 3000;

app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/stripe", stripeRoutes);
app.use(express.json());

app.use("/scrap", scraperRoutes);
app.get("/", (req, res) => res.send("Server is running"));
app.use((req, res, next) => {
  next({ status: 404, message: "Invalid route" });
});
app.use(errorHandler);

(async () => {
  try {
    await watchDockerEvents();
  } catch (err) {
    console.error("Error watching Docker events:", err);
  }
})();

// Start the server
app.listen(PORT, () => {
  console.log("\n\x1b[1m\x1b[32m✓ GMR Scrap Server [%s]\x1b[0m", process.env.APP_ENVIRONMENT || "development");
  console.log("\x1b[1m\x1b[32m✓ Server running on port [: %d]\x1b[0m\n", PORT);
});

// Global error handling for unhandled rejections and exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
