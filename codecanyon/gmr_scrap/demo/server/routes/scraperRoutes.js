const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createMachine } = require("../services/firebaseService");
const { startContainer } = require("../controllers/dockerController");

const project = "map-review-scrap";
const zone = "us-central1-c";

// Imports the Compute library
const { InstancesClient } = require("@google-cloud/compute").v1;

// Instantiates a client
const computeClient = new InstancesClient();

const machineBuildImageName = process.env.MACHINE_BUILD_IMAGE_NAME;
const overviewPrefix = process.env.MACHINES_OVERVIEW_PREFIX || "info";
const reviewsPrefix = process.env.MACHINES_REVIEWS_PREFIX || "comments";

const handleContainerOperations = async (req, res, isInfo = false) => {
  try {
    const { userId, reviewId } = req.data;
    const prefix = isInfo ? overviewPrefix : reviewsPrefix;
    const buildTag = `${prefix}_${userId}_${reviewId}`.toLowerCase();

    await createMachine(buildTag, {
      ...req.data,
      createdAt: +new Date(),
    });

    await startContainer({
      Image: machineBuildImageName,
      name: buildTag,
      Env: [
        `TAG=${buildTag}`,
        `NODE_ENV=${process.env.NODE_ENV}`,
        `FIREBASE_PROJECT_ID=${process.env.FIREBASE_PROJECT_ID}`,
        `STORAGE_BUCKET=gs://fir-scrapp.firebasestorage.app`,
      ],
      Cmd: isInfo ? ["npm", "run", "info"] : ["npm", "run", "start"],
    });

    res.json({ message: "Started" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function callInsert(config) {
  // Construct request
  const request = {
    instanceResource: {
      canIpForward: false,
      confidentialInstanceConfig: {
        enableConfidentialCompute: false,
      },
      deletionProtection: false,
      description: "",
      disks: [
        {
          autoDelete: true,
          boot: true,
          deviceName: "instance-20241214-180306",
          initializeParams: {
            diskSizeGb: "10",
            diskType:
              "projects/map-review-scrap/zones/us-central1-f/diskTypes/pd-balanced",
            labels: {},
            sourceImage:
              "projects/debian-cloud/global/images/debian-12-bookworm-v20241210",
          },
          mode: "READ_WRITE",
          type: "PERSISTENT",
        },
      ],
      displayDevice: {
        enableDisplay: false,
      },
      guestAccelerators: [],
      instanceEncryptionKey: {},
      keyRevocationActionType: "NONE",
      labels: {
        "goog-ec-src": "vm_add-rest",
      },
      machineType:
        "projects/map-review-scrap/zones/us-central1-c/machineTypes/e2-standard-2",
      metadata: {
        items: [
          {
            key: "startup-script",
            value: `
              #! /bin/bash
              # Update package list and install required tools
              apt update && apt install -y unzip wget chromium nodejs npm

              # Download the archive
              gsutil cp gs://machine_gmr_scrap/mch.zip /tmp/gmrscrap.zip

              # Ensure the directory exists and unzip the archive
              mkdir -p /tmp/gmrs
              unzip /tmp/gmrscrap.zip -d /tmp/gmrs

              gsutil cp gs://machine_gmr_scrap/firebasekeys.json /tmp 

              # Move to the directory
              cd /tmp/gmrs

              # Install the dependencies
              npm install

              # Create the .env file
              echo "TAG=${config.tag}" > .env

              # Run the tests
              npm run test

              # Remove the vm after 5min
              sleep 300
              gcloud compute instances delete instance-20241214-093452 --zone=us-central1-a --quiet
            `,
          },
        ],
      },
      name: "instance-20241214-180306",
      networkInterfaces: [
        {
          accessConfigs: [
            {
              name: "External NAT",
              networkTier: "PREMIUM",
            },
          ],
          stackType: "IPV4_ONLY",
          subnetwork:
            "projects/map-review-scrap/regions/us-central1/subnetworks/default",
        },
      ],
      params: {
        resourceManagerTags: {},
      },
      reservationAffinity: {
        consumeReservationType: "ANY_RESERVATION",
      },
      scheduling: {
        automaticRestart: true,
        onHostMaintenance: "MIGRATE",
        provisioningModel: "STANDARD",
      },
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
          ],
        },
      ],
      shieldedInstanceConfig: {
        enableIntegrityMonitoring: true,
        enableSecureBoot: false,
        enableVtpm: true,
      },
      tags: {
        items: [],
      },
      zone: "projects/map-review-scrap/zones/us-central1-c",
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

    await createMachine(buildTag, {
      ...req.data,
      createdAt: +new Date(),
    });

    console.log("buildTag", buildTag);

    console.log("handleContainerOperations");
    // comments_xhee0nn4t9wmmepm3h3yu3jaxcb3_jqiplauiye69frh1ps9n
    const machn = await callInsert({
      tag: buildTag,
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
    });

    console.log("machn", machn);

    res.json({ message: machn });
  }
);

module.exports = router;
