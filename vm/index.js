const { googleCloudZones } = require("../config/constants");

// Imports the Compute library
const { InstancesClient } = require("@google-cloud/compute").v1;

// Instantiates a client
const computeClient = new InstancesClient();

const googleProjectId = "migrant365-landing";
const serviceAccountEmail = "1063609531350-compute@developer.gserviceaccount.com";

async function startVmInstance(config) {
  const zone =
    googleCloudZones[Math.floor(Math.random() * googleCloudZones.length)];
  const uniqueInstanceName = config.tag.replace(/_/g, "-");
  let machineType = "e2-small";
  const diskSizeGb = 10;
  const sourceImage = "projects/debian-cloud/global/images/debian-12-bookworm-v20250311";
  const machineImageName = "gmrscrap";

  const request = {
    instanceResource: {
      disks: [
        {
          autoDelete: true,
          boot: true,
          deviceName: uniqueInstanceName,
          initializeParams: {
            diskSizeGb,
            diskType: `projects/${googleProjectId}/zones/${zone}/diskTypes/pd-balanced`,
            labels: {},
            sourceImage
          },
          mode: "READ_WRITE",
          type: "PERSISTENT",
        },
      ],
      machineType: `projects/${googleProjectId}/zones/${zone}/machineTypes/${machineType}`,
      metadata: {
        items: [
          {
            key: "startup-script",
            value: `
              #! /bin/bash
              ${config.startupScript}

              # Remove the instance
              gcloud compute instances delete ${uniqueInstanceName} --zone=${zone} --project=${googleProjectId} --quiet
            `,
          },
        ],
      },
      name: uniqueInstanceName,
      serviceAccounts: [
        {
          email: serviceAccountEmail,
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
      sourceMachineImage: `projects/${googleProjectId}/global/machineImages/${machineImageName}`,
      zone: `projects/${googleProjectId}/zones/${zone}`,
    },
    project: googleProjectId,
    zone: zone,
  };

  // Run request
  const response = await computeClient.insert(request);

  return response;
}

module.exports = {
  startVmInstance,
};