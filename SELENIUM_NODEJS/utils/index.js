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
  const serviceName = 'latestgchrome';
  try {
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
  } catch (error) {
    console.error('Error adding IAM policy binding:', error);
  }

  // const jsonPayload = firestoreReceived.value.jsonPayload;
  // const fields = jsonPayload.fields;

  // const url = fields.url.stringValue;

  // const token = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  // const driver = new Builder()
  //   .forBrowser(webdriver.Browser.CHROME)
  //   .usingServer(`https://latestgchrome-348810635690.us-central1.run.app/wd/hub`)
  //   .build();

  // await driver.get('https://maps.app.goo.gl/7BEYcHcHi5M1SmVf6');
  // const title = await driver.getTitle();
  // console.log('Page title:', title);

  // // exit driver
  // driver.quit();
  // console.log('Driver quit');

  // const parent = 'projects/map-review-scrap/locations/us-central1';

  // const service = {
  //   template: {
  //     containers: [
  //       {
  //         image: 'selenium/standalone-chrome:dev',
  //         ports: [{
  //           containerPort: 4444
  //         }],
  //         resources: {
  //           limits: {
  //             cpu: '8',
  //             memory: '8Gi'
  //           }
  //         },
  //         // unauthenticated invoker
  //         serviceAccount: '

  //       }
  //     ]
  //   },
  // };

  // const serviceId = 'latestgchrome';

  // const request = {
  //   parent,
  //   serviceId,
  //   service
  // };

  // try {
  //   // Run request
  //   const [operation] = await runClient.createService(request);
  //   const [response] = await operation.promise();
  //   console.log('Service created:', response);
  // } catch (error) {
  //   console.error('Error creating service:', error);
  // }

  // change 
  // Allow unauthenticated invocations
  // Check this if you are creating a public API or website.
  // gcloud run services add-iam-policy-binding latestgchrome \
  //   --member=allUsers \
  //   --role=roles/run.invoker \
  //   --region=us-central1

  console.log('Service invoker added');



  // const deployCommand = `gcloud run deploy latestgchrome \
  //   --image selenium/standalone-chrome:dev} \
  //   --platform managed \
  //   --region us-central1 \
  //   --allow-unauthenticated \
  //   --port 4444 \
  //   --cpu 8 \
  //   --memory 8Gi`;

  // exec(deployCommand, (error, stdout, stderr) => {
  //   if (error) {
  //     return reject(`Error deploying service: ${stderr}`);
  //   }

  //   // Retrieve the service URL
  //   const urlCommand = `gcloud run services describe ${containerName} --region us-central1 --format "value(status.url)"`;
  //   exec(urlCommand, (err, urlStdout, urlStderr) => {
  //     if (err) {
  //       return reject(`Error retrieving service URL: ${urlStderr}`);
  //     }
  //     resolve(urlStdout.trim());
  //   });
  // });

});
