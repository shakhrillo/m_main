const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createMachine } = require("../services/firebaseService");
// const { startContainer } = require("../controllers/dockerController");

const project = "map-review-scrap";
const googleCloudZones = [
  // Africa
  "africa-north1-a",
  "africa-north1-b",
  "africa-north1-c",
  "africa-south1-a",
  "africa-south1-b",
  "africa-south1-c",

  // Asia
  "asia-east1-a",
  "asia-east1-b",
  "asia-east1-c",
  "asia-east2-a",
  "asia-east2-b",
  "asia-east2-c",
  "asia-northeast1-a",
  "asia-northeast1-b",
  "asia-northeast1-c",
  "asia-northeast2-a",
  "asia-northeast2-b",
  "asia-northeast2-c",
  "asia-northeast3-a",
  "asia-northeast3-b",
  "asia-northeast3-c",
  "asia-south1-a",
  "asia-south1-b",
  "asia-south1-c",
  "asia-south2-a",
  "asia-south2-b",
  "asia-south2-c",
  "asia-southeast1-a",
  "asia-southeast1-b",
  "asia-southeast1-c",
  "asia-southeast2-a",
  "asia-southeast2-b",
  "asia-southeast2-c",

  // Australia
  "australia-southeast1-a",
  "australia-southeast1-b",
  "australia-southeast1-c",
  "australia-southeast2-a",
  "australia-southeast2-b",
  "australia-southeast2-c",

  // Europe
  "europe-central2-a",
  "europe-central2-b",
  "europe-central2-c",
  "europe-north1-a",
  "europe-north1-b",
  "europe-north1-c",
  "europe-southwest1-a",
  "europe-southwest1-b",
  "europe-southwest1-c",
  "europe-west1-a",
  "europe-west1-b",
  "europe-west1-c",
  "europe-west2-a",
  "europe-west2-b",
  "europe-west2-c",
  "europe-west3-a",
  "europe-west3-b",
  "europe-west3-c",
  "europe-west4-a",
  "europe-west4-b",
  "europe-west4-c",
  "europe-west6-a",
  "europe-west6-b",
  "europe-west6-c",
  "europe-west8-a",
  "europe-west8-b",
  "europe-west8-c",
  "europe-west9-a",
  "europe-west9-b",
  "europe-west9-c",
  "europe-west10-a",
  "europe-west10-b",
  "europe-west10-c",
  "europe-west12-a",
  "europe-west12-b",
  "europe-west12-c",

  // North America
  "northamerica-northeast1-a",
  "northamerica-northeast1-b",
  "northamerica-northeast1-c",
  "northamerica-northeast2-a",
  "northamerica-northeast2-b",
  "northamerica-northeast2-c",
  "us-central1-a",
  "us-central1-b",
  "us-central1-c",
  "us-central1-f",
  "us-east1-b",
  "us-east1-c",
  "us-east1-d",
  "us-east4-a",
  "us-east4-b",
  "us-east4-c",
  "us-west1-a",
  "us-west1-b",
  "us-west1-c",
  "us-west2-a",
  "us-west2-b",
  "us-west2-c",
  "us-west3-a",
  "us-west3-b",
  "us-west3-c",
  "us-west4-a",
  "us-west4-b",
  "us-west4-c",

  // South America
  "southamerica-east1-a",
  "southamerica-east1-b",
  "southamerica-east1-c",
  "southamerica-west1-a",
  "southamerica-west1-b",
  "southamerica-west1-c",

  // Middle East
  "me-central1-a",
  "me-central1-b",
  "me-central1-c",
  "me-west1-a",
  "me-west1-b",
  "me-west1-c",
];
function pickRandomZone() {
  return googleCloudZones[Math.floor(Math.random() * googleCloudZones.length)];
}
let zone = pickRandomZone();
let machineType = "e2-small";

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
  const uniqueInstanceName = config.tag.replace(/_/g, "-");

  if (uniqueInstanceName.includes("comments")) {
    zone = pickRandomZone();
    machineType = "n2-standard-2";
  }

  // Construct request
  const request = {
    instanceResource: {
      // canIpForward: false,
      // confidentialInstanceConfig: {
      //   enableConfidentialCompute: false,
      // },
      // deletionProtection: false,
      // description: "",
      disks: [
        {
          autoDelete: true,
          boot: true,
          deviceName: uniqueInstanceName,
          initializeParams: {
            diskSizeGb: "10",
            diskType:
              "projects/map-review-scrap/zones/us-central1-f/diskTypes/pd-standard",
            labels: {},
            sourceImage:
              "projects/debian-cloud/global/images/debian-12-bookworm-v20241210",
          },
          mode: "READ_WRITE",
          type: "PERSISTENT",
        },
      ],
      // displayDevice: {
      //   enableDisplay: false,
      // },
      // guestAccelerators: [],
      // instanceEncryptionKey: {},
      // keyRevocationActionType: "NONE",
      // labels: {
      //   "goog-ec-src": "vm_add-rest",
      // },
      machineType: `projects/map-review-scrap/zones/${zone}/machineTypes/${machineType}`,
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
              gcloud compute instances delete ${uniqueInstanceName} --zone=${zone} --project=map-review-scrap --quiet
            `,
          },
        ],
      },
      name: uniqueInstanceName,
      // networkInterfaces: [
      //   {
      //     accessConfigs: [
      //       {
      //         name: "External NAT",
      //         networkTier: "PREMIUM",
      //       },
      //     ],
      //     stackType: "IPV4_ONLY",
      //     subnetwork:
      //       "projects/map-review-scrap/regions/us-central1/subnetworks/default",
      //   },
      // ],
      // params: {
      //   resourceManagerTags: {},
      // },
      // reservationAffinity: {
      //   consumeReservationType: "ANY_RESERVATION",
      // },
      // scheduling: {
      //   automaticRestart: true,
      //   onHostMaintenance: "MIGRATE",
      //   provisioningModel: "STANDARD",
      // },
      serviceAccounts: [
        {
          email: "gmrscrap@map-review-scrap.iam.gserviceaccount.com",
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
      // shieldedInstanceConfig: {
      //   enableIntegrityMonitoring: true,
      //   enableSecureBoot: false,
      //   enableVtpm: true,
      // },
      sourceMachineImage:
        "projects/map-review-scrap/global/machineImages/gmrscrap",
      // tags: {
      //   items: [],
      // },
      zone: `projects/map-review-scrap/zones/${zone}`,
    },
    project,
    zone,
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
