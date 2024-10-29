const { Builder } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const openOverviewTab = require('./openOverviewTab');
const openReviewTab = require('./openReviewTab');
const sortReviewsByNewest = require('./sortReviewsByNewest');
const reviewTabParentElement = require('./reviewTabParentElement');
const beforeTheLastChildInsideParentChildren = require('./beforeTheLastChildInsideParentChildren');
const extractReviewText = require('./extractReviewText');
const extractImageUrlsFromButtons = require('./extractImageUrlsFromButtons');
const clickShowMorePhotosButton = require('./clickShowMorePhotosButton');
const clickExpandReviewButtons = require('./clickExpandReviewButtons');
const clickShowReviewInOriginalButtons = require('./clickShowReviewInOriginalButtons');
const clickExpandOwnerResponseButtons = require('./clickExpandOwnerResponseButtons');
const clickShowOwnerResponseInOriginalButtons = require('./clickShowOwnerResponseInOriginalButtons');

const chrome = require("selenium-webdriver/chrome");

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

async function runWebDriverTest(wbURL, reviewURL, uid, pushId, isDev) {
  let driver;
  const options = new chrome.Options();
  options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");

  try {
    if (isDev) {
      driver = new Builder()
        .forBrowser(webdriver.Browser.CHROME)
        .build();
    } else {
      driver = new Builder()
        .forBrowser(webdriver.Browser.CHROME)
        .usingServer(`${wbURL}/wd/hub`)
        .setChromeOptions(options)
        .build();
    }

    await driver.get(reviewURL);
    const title = await driver.getTitle();
    console.log('Page title:', title);

    if (!isDev) {
      await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
        title: title,
        createdAt: new Date(),
        seleniumSession: `${wbURL}/ui/#/sessions`,
        status: 'in-progress'
      });
    }

    openOverviewTab(driver);
    await driver.sleep(2000);
    await openReviewTab(driver);
    await driver.sleep(2000);
    await sortReviewsByNewest(driver);
    await driver.sleep(2000);
    let { parentElm } = await reviewTabParentElement(driver);

    if (!parentElm) {
      console.log('Parent element not found');
      return;
    }

    console.log('Parent element loaded');

    let currentScrollHeight = await driver.executeScript("return arguments[0].scrollHeight;", parentElm);
    const messages = [];
    let lastElementId = null;

    let count = 0;
    let isFullyLoaded = false;

    while (!isFullyLoaded) {
      const driverSession = await driver.getSession();
      console.log('Session ID:', driverSession.getId());
      
      if (!driverSession) {
        // reconnect driver
        console.log('Reconnecting driver');

        await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
          status: 'reconnecting',
          reconnectedAt: new Date()
        });

        driver = new Builder()
          .forBrowser(webdriver.Browser.CHROME)
          .usingServer(`${wbURL}/wd/hub`)
          .build();

        console.log('Reconnected driver');

        await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
          status: 'reccnnected',
          reconnectedAt: new Date()
        });

      }

      console.log('Scrolling to the bottom');
      console.log('Extracted messages:', messages.length);

      await driver.sleep(2000);
      let { parentElm } = await reviewTabParentElement(driver);
      
      const { allElements, lastValidElementId, lastChildChildrenLength } = await beforeTheLastChildInsideParentChildren(parentElm, lastElementId);
      console.log('Elements:', allElements.length);
      console.log('Last element id:', lastValidElementId);
      lastElementId = lastValidElementId;

      for (const e of allElements) {
        if (!e.element) {
          continue;
        }

        await clickExpandReviewButtons(e.element);
        await clickShowMorePhotosButton(e.element);
        await clickShowReviewInOriginalButtons(e.element);
        await clickExpandOwnerResponseButtons(e.element);
        await clickShowOwnerResponseInOriginalButtons(e.element);

        const message = {
          ...(await extractReviewText(e.element)),
          imageUrls: await extractImageUrlsFromButtons(e.element),
          id: e.id
        };
        console.log('Message:', message);
        
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

    if (!isDev) {
      let collectionReviews = firestore.collection(`users/${uid}/reviews/${pushId}/reviews`);
      batchWriteLargeArray(collectionReviews, messages);
  
      await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
        status: 'completed',
        completedAt: new Date(),
        totalReviews: messages.length
      });
    }

    console.log('Messages:', messages.length);
  } catch (error) {
    if (driver) {
      await driver.quit();
    }
    console.error('Error:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
    console.warn('Driver quit');
  }
}

module.exports = runWebDriverTest;