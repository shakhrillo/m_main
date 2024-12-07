const { docker } = require("./docker");
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

    const activeStreams = new Map(); // Keep track of active streams

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

              if (status !== "destroy") {
                const container = docker.getContainer(name);
                if (status === "die") {
                  container.remove();
                  if (activeStreams.has(name)) {
                    const stream = activeStreams.get(name);
                    stream.removeAllListeners(); // Unsubscribe from the stream
                    activeStreams.delete(name); // Remove from active streams
                    console.log(`Unsubscribed from container: ${name}`);
                  }
                }

                if (container) {
                  container.stats((err, stream) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    stream.setEncoding("utf8");
                    stream.on("data", (data) => {
                      const stats = JSON.parse(data);
                      // console.log("Stats:", stats);

                      db.collection("machines")
                        .doc(name)
                        .set({ stats }, { merge: true });
                    });

                    activeStreams.set(name, stream); // Keep track of the stream
                  });
                }
              }
            }

            if (status === "destroy") {
              docker.info(async (err, info) => {
                if (err) {
                  console.error("Error fetching Docker info:", err);
                } else {
                  console.log("Docker Engine Info:");
                  try {
                    await db
                      .collection("docker")
                      .doc("info")
                      .set({ info: JSON.stringify(info) }, { merge: true });
                  } catch (error) {
                    console.error("Error saving Docker info:", error);
                  }
                }
              });
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
