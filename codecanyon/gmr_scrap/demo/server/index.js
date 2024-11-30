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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

    // console.log(`Stream data: ${str}`);

    if (
      ["destroy", "tag", "untag", "start", "die"].includes(status) &&
      /info_|comments_/.test(str)
    ) {
      console.log("Docker event:", str);
      const from = str.match(/"from":"([^"]+)"/);
      if (from) {
        try {
          console.log("From:", from[1]);
          const id = from[1];
          const lines = str.trim().split("\n");
          const parsedData = lines.map((line) => JSON.parse(line));
          for (const data of parsedData) {
            console.log("Data:", data);
            db.collection("machines").doc(id).set(data, { merge: true });
          }
        } catch (error) {
          console.log("Error saving machine data:", error);
        }
      }

      if (status === "tag") {
        const image = str.match(/"name":"([^"]+)"/);
        if (image) {
          try {
            console.log("Image:", image[1]);
            const id = image[1];
            const lines = str.trim().split("\n");
            const parsedData = lines.map((line) => JSON.parse(line));
            for (const data of parsedData) {
              console.log("Start -> Data:", data);
              console.log("Start -> ID:", id);
              const imgName = id.replace(":latest", "");

              replaceFrom = "";
              replaceTo = "";
              let isInfo = false;
              if (imgName.includes("info")) {
                isInfo = true;
                replaceFrom = "info_";
                replaceTo = "comments_";
              } else {
                replaceFrom = "comments_";
                replaceTo = "info_";
              }

              docker.createContainer(
                {
                  Image: imgName,
                  name: imgName.replace(replaceFrom, replaceTo),
                  Env: [`TAG=${imgName}`],
                  Cmd: ["npm", "run", isInfo ? "info" : "start"],
                },
                function (err, container) {
                  if (err) {
                    console.log("Error creating container:", err);
                  }

                  container.start(function (err, data) {
                    if (err) {
                      console.log("Error starting container:", err);
                    }
                  });
                }
              );
              // db.collection("machines").doc(id).set(data, { merge: true });
            }
          } catch (error) {
            console.log("Error saving machine data:", error);
          }
        }
      }

      if (status === "destroy") {
        try {
          let image = str.match(/"image":"([^"]+)"/);
          image = image ? image[1] : "";
          if (image.includes("info") || image.includes("comments")) {
            const dockerImage = docker.getImage(image);
            console.log("Removing image:", dockerImage);
            const containers = docker
              .listContainers((filters = { ancestor: [image] }))
              .then((containers) => {
                console.log("Containers:", containers);
              });
            if (dockerImage) {
              try {
                dockerImage.remove({ force: true });
              } catch (e) {
                console.log("__e", e);
              }
            }
          }
        } catch (error) {
          console.log("Error removing image:", error);
        }
      }

      if (status === "die") {
        // delete the container
        const id = str.match(/"id":"([^"]+)"/);
        if (id) {
          try {
            const container = docker.getContainer(id[1]);
            console.log("Removing container:", container);
            if (container) {
              container.remove({ force: true });
            }
          } catch (error) {
            console.log("Error removing container:", error);
          }
        }
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
