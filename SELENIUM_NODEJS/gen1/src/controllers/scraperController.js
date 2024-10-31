const wait = require('../utils/wait');
const { launchBrowser, openPage } = require('../utils/browser');
const { clickReviewTab, scrollAndCollectElements } = require('../utils/elementUtils');
const filterUniqueElements = require('../utils/filter');
const { waitTime } = require('../config/settings');

const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'map-review-scrap'
});

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
  try {
    const browser = await launchBrowser();  
    await wait(waitTime);
    const page = await openPage(browser, url);
    
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
    await wait(20000000);
  
    const allElements = await scrollAndCollectElements(page, firestore, uid, pushId);
    const uniqueElements = filterUniqueElements(allElements);
  
    console.log('Unique elements:', uniqueElements.length);
    console.log('All elements:', allElements.length);
    // if (uniqueElements.length > 0) {
    //   console.log('First text:', uniqueElements[0].textContent);
    // }
  
    // show last 5 elements
    // const lastFive = uniqueElements.slice(-5);
    // lastFive.forEach((element) => {
    //   console.log('Element:', element.textContent);
    // });
  
    await page.close();
    await browser.close();
  
    // clearInterval(monitorInterval);  // Stop monitoring when Puppeteer is done
  
    // console.log(`Max CPU: ${maxCPU.toFixed(2)}%, Max Memory: ${maxMemory.toFixed(2)} MB`);
  
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
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Export the main function for Google Cloud Functions
module.exports = main;
