const wait = require('../utils/wait');
const { launchBrowser, openPage } = require('../utils/browser');
const { clickReviewTab, scrollAndCollectElements } = require('../utils/elementUtils');
const filterUniqueElements = require('../utils/filter');
const { waitTime } = require('../config/settings');

const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'map-review-scrap'
});

const pidusage = require('pidusage');
let maxCPU = 0;
let maxMemory = 0;

// Function to monitor and update max CPU and memory usage
async function monitorUsage(pid) {
  const stats = await pidusage(pid);
  const cpuUsage = stats.cpu;
  const memoryUsage = stats.memory / (1024 * 1024);  // Convert memory to MB

  if (cpuUsage > maxCPU) maxCPU = cpuUsage;
  if (memoryUsage > maxMemory) maxMemory = memoryUsage;

  console.log(`Current CPU: ${cpuUsage.toFixed(2)}%, Memory: ${memoryUsage.toFixed(2)} MB`);
}

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

async function main(url, uid, pushId, isDev) {
  const browser = await launchBrowser();
  
  const pid = browser.process().pid;
  // Set up interval to check CPU and memory every 2 seconds
  const monitorInterval = setInterval(async () => {
    await monitorUsage(pid);
  }, 2000);


  const page = await openPage(browser, url);

  // Enable request interception before setting up the request listener
  // await page.setRequestInterception(true);

  // // Set up request interception
  // page.on('request', (request) => {
  //   if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
  //     request.abort(); // Block non-essential resources to save memory and CPU
  //   } else {
  //     request.continue();
  //   }
  // });
  
  if (!isDev) {
    await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
      title: await page.title(),
      createdAt: new Date(),
      status: 'in-progress'
    });
  }

  await wait(waitTime);
  await clickReviewTab(page);
  await wait(waitTime);
  // button aria-label="Sort reviews"
  const sortButton = await page.$('button[aria-label="Sort reviews"]');
  if (!sortButton) {
    throw new Error('Sort button not found');
  }
  sortButton.click();
  await wait(2000);
  const menuItemRadios = await page.$$('[role="menuitemradio"]');
  for (menuItem of menuItemRadios) {
    const text = await page.evaluate((el) => el.textContent, menuItem);
    if (text === 'Newest') {
      console.log('Clicking newest menu item');
      menuItem.click();
      break;
    }
  }
  await wait(2000);

  const allElements = await scrollAndCollectElements(page);
  const uniqueElements = filterUniqueElements(allElements);

  console.log('Unique elements:', uniqueElements.length);
  console.log('All elements:', allElements.length);
  if (uniqueElements.length > 0) {
    console.log('First text:', uniqueElements[0].textContent);
  }

  // show last 5 elements
  const lastFive = uniqueElements.slice(-5);
  lastFive.forEach((element) => {
    console.log('Element:', element.textContent);
  });

  await page.close();
  await browser.close();

  clearInterval(monitorInterval);  // Stop monitoring when Puppeteer is done

  console.log(`Max CPU: ${maxCPU.toFixed(2)}%, Max Memory: ${maxMemory.toFixed(2)} MB`);

  if(!isDev) {
    let collectionReviews = firestore.collection(`users/${uid}/reviews/${pushId}/reviews`);
    const messages = allElements.map((element) => {
      return {
        id: element.id || '',
        text: element.text || '',
        textContent: element.textContent || '',
      };
    });
    await batchWriteLargeArray(collectionReviews, messages);
  
    await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
      status: 'completed',
      totalReviews: uniqueElements.length,
      completedAt: new Date()
    });
  }

  return uniqueElements;
}

// Export the main function for Google Cloud Functions
module.exports = main;
