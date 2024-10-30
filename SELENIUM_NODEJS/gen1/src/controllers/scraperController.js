const wait = require('../utils/wait');
const { launchBrowser, openPage } = require('../utils/browser');
const { clickReviewTab, scrollAndCollectElements } = require('../utils/elementUtils');
const filterUniqueElements = require('../utils/filter');
const { waitTime } = require('../config/settings');

async function main(url) {
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  await wait(waitTime);
  await clickReviewTab(page);
  await wait(waitTime);
  const allElements = await scrollAndCollectElements(page);
  const uniqueElements = filterUniqueElements(allElements);

  console.log('Unique elements:', uniqueElements.length);
  console.log('All elements:', allElements.length);
  if (uniqueElements.length > 0) {
    console.log('First text:', uniqueElements[0].text);
  }

  await browser.close();
}

// Export the main function for Google Cloud Functions
module.exports = main;
