const project = "map-review-scrap";
const zone = "us-central1-a";
// const instance = "2406995406324394108";

// Imports the Compute library
const { InstancesClient } = require("@google-cloud/compute").v1;

// Instantiates a client
const computeClient = new InstancesClient();

async function callInsert() {
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
          deviceName: "instance-20241214-093452",
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
        "projects/map-review-scrap/zones/us-central1-a/machineTypes/e2-micro",
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
              echo "DB_HOST=your-db-host" > .env
              echo "DB_USER=your-db-user" >> .env
              echo "DB_PASS=your-db-pass" >> .env

              # Run the tests
              npm run test

              # Remove the vm after 5min
              sleep 300
              gcloud compute instances delete instance-20241214-093452 --zone=us-central1-a --quiet
            `,
          },
        ],
      },
      name: "instance-20241214-093452",
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
          email: "348810635690-compute@developer.gserviceaccount.com",
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
      zone: "projects/map-review-scrap/zones/us-central1-a",
    },
    project,
    zone,
  };

  // Run request
  const response = await computeClient.insert(request);
  console.log(response);
}

async function deleteInstance() {
  const request = {
    project,
    zone,
    instance: "instance-20241214-093452",
  };

  const [response] = await computeClient.delete(request);
  console.log(response);
}

// deleteInstance().catch(console.error);
callInsert().catch(console.error);
