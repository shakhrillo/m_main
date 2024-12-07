const { docker } = require("./docker");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const dockerRoutes = require("./routes/dockerRoutes");
const machinesRoutes = require("./routes/machinesRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const errorHandler = require("./middlewares/errorHandler");
const logger = require("./config/logger");
const { db } = require("./firebase");
const { buildImage } = require("./controllers/dockerController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Detect docker image
    // await buildImage();

    console.log("---".repeat(20));
    console.log("---".repeat(20));

    // Middlewares
    app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
    app.use(express.urlencoded({ extended: true }));

    app.use("/api/stripe", stripeRoutes);
    app.use(express.json());

    app.use("/api/docker", dockerRoutes);
    app.use("/api/machines", machinesRoutes);
    app.use("/api/scrap", scraperRoutes);

    // Default route
    app.get("/", (req, res) => {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      res.send(`
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

    // Watch docker events
    docker.getEvents().then((stream) => {
      stream.setEncoding("utf8");
      stream.on("data", (data) => {
        const str = data.toString();
        let status = str.match(/"status":"([^"]+)"/);
        status = status ? status[1] : "";

        console.log("-->", str);

        if (/info_|comments_/.test(str)) {
          console.log("Docker event:", str);

          try {
            const lines = str.trim().split("\n");
            const parsedData = lines.map((line) => JSON.parse(line));
            for (const data of parsedData) {
              const name = data.Actor.Attributes.name;
              db.collection("machines").doc(name).set(data, { merge: true });
            }
          } catch (error) {
            console.log("Error saving machine data:", error);
          }
        }
      });
    });

    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error connecting to Firestore:", error);
  }
};

startServer();
