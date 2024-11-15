const { exec } = require("child_process");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const scrap = require("../controllers/scraperController");
const scrapInfo = require("../controllers/scraperInfoController");
const runDocker = async (dName, port) => {
  try {
    const output = await new Promise((resolve, reject) => {
      exec(
        `docker run -d --name ${dName} -e PORT=${port} -p ${port}:${port} browserless/chrome > /dev/null 2>&1`,
        (error, stdout, stderr) => {
          if (error) {
            reject(`exec error: ${error}`);
            return;
          }

          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }

          // The container ID is output when using -d (detached mode)
          resolve(stdout.trim());
        }
      );
    });

    console.log(`Container started with ID: ${output}`);
    return output;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function removeDocer(port) {
  try {
    const { exec } = require("child_process");
    const dName = `browserlesschrome-${port}`;
    exec(`docker rm -f ${dName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      console.log(`Container removed with ID: ${stdout.trim()}`);
    });
  } catch (error) {
    console.error(error);
  }
}

router.post("/", authenticateToken, async (req, res) => {
  console.log("Request Data:", req.data);
  // random port
  const port = Math.floor(Math.random() * 10000) + 3000;
  console.log("Port:", port);
  // const dName = `browserlesschrome-${port}`;
  const containerId = await runDocker("dName", port);
  console.log("Port:", containerId);
  // wait 5sec
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // stop docker

  scrap(req.data, port);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  // scrap(req.data);
  res.json(req.data);
});

router.post("/info", authenticateToken, async (req, res) => {
  console.log("Request Data:", req.data);
  // random port
  const port = Math.floor(Math.random() * 10000) + 3000;
  console.log("Port:", port);
  const dName = `browserlesschrome-${port}`;
  const containerId = await runDocker(dName, port);
  console.log("Port:", containerId);
  // wait 5sec
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const data = await scrapInfo(req.data, port);
  // stop docker
  await removeDocer(port);
  console.log("Data:", data);
  res.json(data);
});

module.exports = router;
