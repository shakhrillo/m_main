const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { startContainer } = require("../controllers/dockerController");
const { startVmInstance } = require("../controllers/googleController");

const environment = process.env.NODE_ENV || "development";
const machineBuildImageName =
  process.env.MACHINE_BUILD_IMAGE_NAME || "gmrscrap-machine";
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "fir-scrapp";

const handleContainerOperations = async (req, res, isInfo = false) => {
  try {
    console.log("Request data", req.data);
    const { tag } = req.data;

    console.log(
      "Starting container>>",
      tag,
      machineBuildImageName,
      firebaseProjectId
    );

    if (environment === "production") {
      if (tag.includes("info")) {
        await startContainer({
          Image: machineBuildImageName,
          name: tag,
          Env: [
            `TAG=${tag}`,
            `NODE_ENV=${environment}`,
            `FIREBASE_PROJECT_ID=${firebaseProjectId}`,
          ],
          Cmd: ["npm", "run", "info"],
          HostConfig: {
            AutoRemove: !true,
          },
        });
      } else {
        await startVmInstance({
          tag,
          startupScript: `
            # Run the tests
            cd /home/st/m_main/codecanyon/gmr_scrap/demo/selenium_machine
  
            #docker run \
            #  --name ${tag} \
            #  -e TAG=${tag} \
            #  -e NODE_ENV=${environment} \
            #  -e FIREBASE_PROJECT_ID=${firebaseProjectId} \
            #  ${machineBuildImageName} \
  
            # Remove environment file
            rm -f .env
  
            # Create environment file
            echo "TAG=${tag}" > .env
            echo "NODE_ENV=${environment}" >> .env
            echo "FIREBASE_PROJECT_ID=${firebaseProjectId}" >> .env
  
            ${isInfo ? "npm run info" : "npm run start"}
          `,
        });
      }
    }

    if (environment === "development") {
      await startContainer({
        Image: machineBuildImageName,
        name: tag,
        Env: [
          `TAG=${tag}`,
          `NODE_ENV=${environment}`,
          `FIREBASE_PROJECT_ID=${firebaseProjectId}`,
          `FIREBASE_URL=host.docker.internal`,
          `CHROME_PATH=/usr/bin/chromium-browser`,
        ],
        Cmd: isInfo ? ["npm", "run", "info"] : ["npm", "run", "start"],
        HostConfig: {
          AutoRemove: !true,
        },
      });
    }

    res.json({ message: "Started" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.post("/", authMiddleware, async (req, res) =>
  handleContainerOperations(req, res)
);

router.post("/info", authMiddleware, async (req, res) =>
  handleContainerOperations(req, res, true)
);

module.exports = router;
