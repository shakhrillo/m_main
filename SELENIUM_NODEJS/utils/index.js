const functions = require('@google-cloud/functions-framework');
const protobuf = require('protobufjs');
const { ServicesClient } = require('@google-cloud/run').v2;
const runWebDriverTest = require('./selenium-helper/runWebDriverTest');

const runClient = new ServicesClient();

async function loadProto() {
  console.log('Loading protos...');
  const root = await protobuf.load('data.proto');
  return root.lookupType('google.events.cloud.firestore.v1.DocumentEventData');
}

async function decodeFirestoreData(DocumentEventData, data) {
  console.log('Decoding data...');
  return DocumentEventData.decode(data);
}

async function createCloudRunService(projectId, region) {
  const serviceName = 'latestgchromesel2' + Date.now();
  const parent = `projects/${projectId}/locations/${region}`;

  const service = {
    template: {
      containers: [
        {
          image: 'selenium/standalone-chrome:dev',
          ports: [{ containerPort: 4444 }],
          resources: { limits: { cpu: '8', memory: '32Gi' } },
          livenessProbe: {
            httpGet: {
              path: '/status',
              port: 4444
            },
            initialDelaySeconds: 30,
            periodSeconds: 10
          },
        }
      ],
      health_check_disabled: false
    }
  };

  try {
    const [operation] = await runClient.createService({
      parent,
      serviceId: serviceName,
      service
    });
    const [response] = await operation.promise();
    console.log('Service created:', response);
    return { uri: response.uri, serviceName };
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

async function configureIAMPolicy(projectId, region, serviceName) {
  const resource = `projects/${projectId}/locations/${region}/services/${serviceName}`;
  const [policy] = await runClient.getIamPolicy({ resource });

  policy.bindings.push({
    role: 'roles/run.invoker',
    members: ['allUsers']
  });

  await runClient.setIamPolicy({ resource, policy });
  console.log(`Successfully added IAM policy binding to ${serviceName}`);
}

async function deleteService(projectId, region, serviceName) {
  const resource = `projects/${projectId}/locations/${region}/services/${serviceName}`;
  await runClient.deleteService({ name: resource });
  console.warn('Service deleted');
}

functions.cloudEvent('messagewatch', async cloudEvent => {
  console.log(`Function triggered by event on: ${cloudEvent.source}`);
  console.log(`Event type: ${cloudEvent.type}`);

  const projectId = 'map-review-scrap';
  const region = 'us-central1';
  let extractedServiceName;

  try {
    const DocumentEventData = await loadProto();
    const firestoreReceived = await decodeFirestoreData(DocumentEventData, cloudEvent.data);
    
    console.log('\nOld value:', JSON.stringify(firestoreReceived.oldValue, null, 2));
    console.log('\nNew value:', JSON.stringify(firestoreReceived.value, null, 2));

    const pushId = firestoreReceived.value.name.split('/').pop();
    console.log('Push ID:', pushId);

    let reviewURL = firestoreReceived.value.fields.url.stringValue;
    console.log('Review URL:', reviewURL);

    let uid = firestoreReceived.value.fields.uid.stringValue;
    console.log('UID:', uid);

    const { uri: wbURL, serviceName } = await createCloudRunService(projectId, region);
    extractedServiceName = serviceName;
    await configureIAMPolicy(projectId, region, serviceName);
    await runWebDriverTest(wbURL, reviewURL, uid, pushId);
    await deleteService(projectId, region, serviceName);

  } catch (error) {
    if (extractedServiceName) {
      await deleteService(projectId, region, extractedServiceName);
    }
    console.error('Error processing Firestore event:', error);
  }
});
