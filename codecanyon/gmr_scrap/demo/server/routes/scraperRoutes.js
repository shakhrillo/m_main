const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createMachine } = require("../services/firebaseService");
const { googleCloudZones, googleCloudProject } = require("../config/constants");
// const { startContainer } = require("../controllers/dockerController");

// Imports the Compute library
const { InstancesClient } = require("@google-cloud/compute").v1;

// Instantiates a client
const computeClient = new InstancesClient();

// const machineBuildImageName = process.env.MACHINE_BUILD_IMAGE_NAME;
const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";

// const handleContainerOperations = async (req, res, isInfo = false) => {
//   try {
//     const { userId, reviewId } = req.data;
//     const prefix = isInfo ? overviewPrefix : reviewsPrefix;
//     const buildTag = `${prefix}_${userId}_${reviewId}`.toLowerCase();

//     await createMachine(buildTag, {
//       ...req.data,
//       createdAt: +new Date(),
//     });

//     await startContainer({
//       Image: machineBuildImageName,
//       name: buildTag,
//       Env: [
//         `TAG=${buildTag}`,
//         `NODE_ENV=${process.env.NODE_ENV}`,
//         `FIREBASE_PROJECT_ID=${process.env.FIREBASE_PROJECT_ID}`,
//         `STORAGE_BUCKET=gs://fir-scrapp.firebasestorage.app`,
//       ],
//       Cmd: isInfo ? ["npm", "run", "info"] : ["npm", "run", "start"],
//     });

//     res.json({ message: "Started" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

async function callInsert(config) {
  const zone =
    googleCloudZones[Math.floor(Math.random() * googleCloudZones.length)];
  const uniqueInstanceName = config.tag.replace(/_/g, "-");
  let machineType = "e2-small";
  const diskSizeGb = 10;

  if (uniqueInstanceName.includes("comments")) {
    machineType = "n2-standard-2";
  }

  // Construct request
  const request = {
    instanceResource: {
      disks: [
        {
          autoDelete: true,
          boot: true,
          deviceName: uniqueInstanceName,
          initializeParams: {
            diskSizeGb,
            diskType: `projects/${googleCloudProject}/zones/${zone}/diskTypes/pd-standard`,
            labels: {},
            sourceImage:
              "projects/debian-cloud/global/images/debian-12-bookworm-v20241210",
          },
          mode: "READ_WRITE",
          type: "PERSISTENT",
        },
      ],
      machineType: `projects/${googleCloudProject}/zones/${zone}/machineTypes/${machineType}`,
      metadata: {
        items: [
          {
            key: "startup-script",
            value: `
              # Run the tests
              cd /home/st/m_main/codecanyon/gmr_scrap/demo

              docker run \
                --name ${config.tag} \
                -e TAG=${config.tag} \
                -e NODE_ENV=production \
                -e FIREBASE_PROJECT_ID=fir-scrapp \
                -e STORAGE_BUCKET=gs://fir-scrapp.firebasestorage.app \
                gmr_scrap_selenium \
                ${config.command}

              # Remove the instance
              gcloud compute instances delete ${uniqueInstanceName} --zone=${zone} --project=${googleCloudProject} --quiet
            `,
          },
        ],
      },
      name: uniqueInstanceName,
      serviceAccounts: [
        {
          email: `gmrscrap@${googleCloudProject}.iam.gserviceaccount.com`,
          scopes: [
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring.write",
            "https://www.googleapis.com/auth/service.management.readonly",
            "https://www.googleapis.com/auth/servicecontrol",
            "https://www.googleapis.com/auth/trace.append",
            "https://www.googleapis.com/auth/cloud-platform",
          ],
        },
      ],
      sourceMachineImage: `projects/${googleCloudProject}/global/machineImages/gmrscrap`,
      zone: `projects/${googleCloudProject}/zones/${zone}`,
    },
    project: googleCloudProject,
    zone: zone,
  };

  // Run request
  const response = await computeClient.insert(request);
  console.log(response);
}

// router.post("/", async (req, res) =>
router.post("/", authMiddleware, async (req, res) =>
  // handleContainerOperations(req, res)
  {
    const { userId, reviewId } = req.data;
    const prefix = reviewsPrefix;
    const buildTag = `${prefix}_${userId}_${reviewId}`.toLowerCase();
    console.log("buildTag", buildTag);

    await createMachine(buildTag, {
      ...req.data,
      createdAt: +new Date(),
    });

    console.log("buildTag>", buildTag);

    console.log("handleContainerOperations");
    // comments_xhee0nn4t9wmmepm3h3yu3jaxcb3_jqiplauiye69frh1ps9n
    const machn = await callInsert({
      tag: buildTag,
      command: "npm run start",
    });

    console.log("machn", machn);

    res.json({ message: machn });
  }
);
router.post("/info", authMiddleware, async (req, res) =>
  // handleContainerOperations(req, res, true)
  {
    const { userId, reviewId } = req.data;
    const prefix = overviewPrefix;
    const buildTag = `${prefix}_${userId}_${reviewId}`.toLowerCase();

    await createMachine(buildTag, {
      ...req.data,
      createdAt: +new Date(),
    });

    console.log("buildTag", buildTag);

    console.log("handleContainerOperations");
    // comments_xhee0nn4t9wmmepm3h3yu3jaxcb3_jqiplauiye69frh1ps9n
    const machn = await callInsert({
      tag: buildTag,
      command: "npm run info",
    });

    console.log("machn", machn);

    res.json({ message: machn });
  }
);

module.exports = router;
