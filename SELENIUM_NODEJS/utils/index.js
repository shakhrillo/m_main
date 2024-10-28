const functions = require('@google-cloud/functions-framework');
const protobuf = require('protobufjs');
const { ServicesClient } = require('@google-cloud/run').v2;
const webdriver = require('selenium-webdriver');
const { Builder } = require('selenium-webdriver');

const runClient = new ServicesClient();

functions.cloudEvent('helloFirestore2', async cloudEvent => {
  console.log(`Function triggered by event on: ${cloudEvent.source}`);
  console.log(`Event type: ${cloudEvent.type}`);

  console.log('Loading protos...');
  const root = await protobuf.load('data.proto');
  const DocumentEventData = root.lookupType(
    'google.events.cloud.firestore.v1.DocumentEventData'
  );

  console.log('Decoding data...');
  const firestoreReceived = DocumentEventData.decode(cloudEvent.data);

  console.log('\nOld value:');
  console.log(JSON.stringify(firestoreReceived.oldValue, null, 2));

  console.log('\nNew value:');
  console.log(JSON.stringify(firestoreReceived.value, null, 2));

  const projectId = 'map-review-scrap';
  const region = 'us-central1';
  const serviceName = 'latestgchromesel2' + Date.now();
  
  try {
    const parent = `projects/${projectId}/locations/${region}`;

    const service = {
      template: {
        containers: [
          {
            image: 'selenium/standalone-chrome:dev',
            ports: [{
              containerPort: 4444
            }],
            resources: {
              limits: {
                cpu: '8',
                memory: '8Gi'
              }
            }
          }
        ]
      },
    };

    const serviceId = serviceName;

    const request = {
      parent,
      serviceId,
      service
    };

    let wbURL = '';

    try {
      // Run request
      const [operation] = await runClient.createService(request);
      const [response] = await operation.promise();
      console.log('Service created:');
      console.log(response)
      wbURL = response.uri;
      console.log('Webdriver URL:', wbURL);

    } catch (error) {
      console.error('Error creating service:', error);
    }

    // Construct the resource name
    const resource = `projects/${projectId}/locations/${region}/services/${serviceName}`;

    // Get the existing IAM policy for the service
    const [policy] = await runClient.getIamPolicy({ resource });

    console.log('Current IAM policy:', JSON.stringify(policy, null, 2));

    // Add the new binding for allUsers
    policy.bindings.push({
      role: 'roles/run.invoker',
      members: ['allUsers'],
    });

    console.log('Updated IAM policy:', JSON.stringify(policy, null, 2));

    // Set the updated IAM policy
    await runClient.setIamPolicy({ resource, policy });

    console.log(`Successfully added IAM policy binding to ${serviceName}`);
    console.log(`Webdriver URL: ${wbURL}`);
    
    const driver = new Builder()
      .forBrowser(webdriver.Browser.CHROME)
      .usingServer(`${wbURL}/wd/hub`)
      .build();

    await driver.get('https://maps.app.goo.gl/7BEYcHcHi5M1SmVf6');
    const title = await driver.getTitle();
    console.log('Page title:', title);

    // exit driver
    await driver.quit();
    console.log('Driver quit');

    // remove service
    await runClient.deleteService({ name: resource });

    console.log('Service deleted');
  } catch (error) {
    console.error('Error adding IAM policy binding:', error);
  }
});
