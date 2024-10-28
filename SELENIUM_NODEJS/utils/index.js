const functions = require('@google-cloud/functions-framework');
const Firestore = require('@google-cloud/firestore');
const protobuf = require('protobufjs');
const { ServicesClient } = require('@google-cloud/run').v2;
const { Builder } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const openOverviewTab = require('./selenium-helper/openOverviewTab');
const openReviewTab = require('./selenium-helper/openReviewTab');
const sortReviewsByNewest = require('./selenium-helper/sortReviewsByNewest');
const reviewTabParentElement = require('./selenium-helper/reviewTabParentElement');
const beforeTheLastChildInsideParentChildren = require('./selenium-helper/beforeTheLastChildInsideParentChildren');
const extractReviewText = require('./selenium-helper/extractReviewText');
const extractImageUrlsFromButtons = require('./selenium-helper/extractImageUrlsFromButtons');

const firestore = new Firestore({
  projectId: 'map-review-scrap'
});

const runClient = new ServicesClient();

async function batchWriteLargeArray(collectionRef, data) {
  const batch = firestore.batch();
  const chunkSize = 500;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    chunk.forEach((doc) => {
      const docRef = collectionRef.doc(doc.id);
      batch.set(docRef, doc);
    });

    await batch.commit();
  }
}


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
          resources: { limits: { cpu: '8', memory: '8Gi' } }
        }
      ]
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

async function runWebDriverTest(wbURL, reviewURL, pushId) {
  const driver = new Builder()
    .forBrowser(webdriver.Browser.CHROME)
    .usingServer(`${wbURL}/wd/hub`)
    .build();

  try {
    // await driver.get('https://maps.app.goo.gl/7BEYcHcHi5M1SmVf6');
    await driver.get(reviewURL);
    const title = await driver.getTitle();
    console.log('Page title:', title);

    openOverviewTab(driver);
    await driver.sleep(2000);
    await openReviewTab(driver);
    await driver.sleep(2000);
    await sortReviewsByNewest(driver);
    await driver.sleep(2000);
    let { parentElm } = await reviewTabParentElement(driver);
    console.log('Parent element loaded');

    let currentScrollHeight = await driver.executeScript("return arguments[0].scrollHeight;", parentElm);
    const messages = [];
    let lastElementId = null;

    let count = 0;
    let isFullyLoaded = false;

    while (!isFullyLoaded) {
      console.log('Scrolling to the bottom');
      let { parentElm } = await reviewTabParentElement(driver);
      const { allElements, lastValidElementId, lastChildChildrenLength } = await beforeTheLastChildInsideParentChildren(parentElm, lastElementId);
      console.log('Elements:', allElements.length);
      console.log('Last element id:', lastValidElementId);
      lastElementId = lastValidElementId;

      for (const e of allElements) {
        const message = {
          ...(await extractReviewText(e.element)),
          imageUrls: await extractImageUrlsFromButtons(e.element, driver),
          id: e.id
        };
        console.log('Message:', message);
        
        // const collectionRef = firestore.collection(`gmpreviews/${pushId}/reviews`);
        // await collectionRef.add(message);
        
        messages.push(message);
        count++;
      }

      // Scroll to the bottom
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", parentElm);

      // Update scroll heights
      previousScrollHeight = currentScrollHeight;
      currentScrollHeight = await driver.executeScript("return arguments[0].scrollHeight;", parentElm);

      console.log('Last child:', lastChildChildrenLength);
      
      if (lastChildChildrenLength === 0) {
        isFullyLoaded = true;
        console.log('Reached the end, scroll height has not changed');
        break;
      }
    }

    batchWriteLargeArray(firestore.collection(`gmpreviews/${pushId}/reviews`), messages);

    console.log('Messages:', messages.length);
  } finally {
    await driver.quit();
    console.log('Driver quit');
  }
}

async function deleteService(projectId, region, serviceName) {
  const resource = `projects/${projectId}/locations/${region}/services/${serviceName}`;
  await runClient.deleteService({ name: resource });
  console.log('Service deleted');
}

functions.cloudEvent('messagewatch', async cloudEvent => {
  console.log(`Function triggered by event on: ${cloudEvent.source}`);
  console.log(`Event type: ${cloudEvent.type}`);

  try {
    const DocumentEventData = await loadProto();
    const firestoreReceived = await decodeFirestoreData(DocumentEventData, cloudEvent.data);
    
    console.log('\nOld value:', JSON.stringify(firestoreReceived.oldValue, null, 2));
    console.log('\nNew value:', JSON.stringify(firestoreReceived.value, null, 2));

    const pushId = firestoreReceived.value.name.split('/').pop();
    console.log('Push ID:', pushId);

    let reviewURL = firestoreReceived.value.fields.url.stringValue;
    console.log('Review URL:', reviewURL);
    
    const projectId = 'map-review-scrap';
    const region = 'us-central1';

    const { uri: wbURL, serviceName } = await createCloudRunService(projectId, region);
    await configureIAMPolicy(projectId, region, serviceName);
    await runWebDriverTest(wbURL, reviewURL, pushId);
    await deleteService(projectId, region, serviceName);

  } catch (error) {
    console.error('Error processing Firestore event:', error);
  }
});
