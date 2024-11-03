const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { uploadFile } = require('../services/storageService');
const wait = require('../utils/wait');
const { launchBrowser, openPage } = require('../utils/browser');
const { clickReviewTab, scrollAndCollectElements } = require('../utils/elementUtils');
const filterUniqueElements = require('../utils/filter');
const { batchWriteLargeArray, updateReview } = require('./reviewController');
const { getUser, updateUser, createUserUsage } = require('./userController');

// Define a temporary directory in your project (e.g., ./temp)
const tempDir = path.join(__dirname, 'temp');

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function main(url, uid, pushId) {
  try {
    const browser = await launchBrowser();  
    const page = await openPage(browser, url);
    await wait(2000);
    
    // Enable request interception
    await page.setRequestInterception(true);
    // Filter out requests for images, stylesheets, and other media
    page.on('request', (request) => {
      const disabledRequests = [
        'googleusercontent',
        'preview',
        'analytics',
        'ads',
        'fonts',
        '/maps/vt'
      ]
      if (disabledRequests.some((disabledRequest) => request.url().includes(disabledRequest))) {
        request.abort();
      } else {
        request.continue();
      }
    });

    const title = await page.title();
    await updateReview(uid, pushId, {
      title,
      createdAt: new Date(),
      status: 'in-progress'
    });

    await clickReviewTab(page);
    await wait(1000);
    const sortButton = await page.$('button[aria-label="Sort reviews"], button[aria-label="Most relevant"]');
    if (!sortButton) {
      throw new Error('Sort button not found');
    }
    sortButton.click();
    await wait(400);
    const menuItemRadios = await page.$$('[role="menuitemradio"]');
    for (menuItem of menuItemRadios) {
      const text = await page.evaluate((el) => el.textContent, menuItem);
      if (text === 'Newest') {
        console.log('Clicking newest menu item');
        menuItem.click();
        break;
      }
    }
  
    const allElements = await scrollAndCollectElements(page, uid, pushId) || [];
    const uniqueElements = filterUniqueElements(allElements);
  
    console.log('Unique elements:', uniqueElements.length);
    console.log('All elements:', allElements.length);
  
    await page.close();
    await browser.close();

    const jsonFileName = path.join(tempDir, `${pushId}.json`);
    const csvFileName = path.join(tempDir, `${pushId}.csv`);
    
    // Write the JSON file
    fs.writeFileSync(jsonFileName, JSON.stringify(uniqueElements, null, 2));

    // Define the CSV writer
    const csvWriter = createCsvWriter({
      path: csvFileName,
      header: Object.keys(uniqueElements[0]).map(key => ({ id: key, title: key })), // Adjust headers based on your data structure
      // Add any additional options if necessary
    });

    // Write the CSV file
    await csvWriter.writeRecords(uniqueElements);

    await uploadFile(fs.readFileSync(jsonFileName), `json/${pushId}.json`);
    await uploadFile(fs.readFileSync(csvFileName), `csv/${pushId}.csv`);

    fs.unlinkSync(jsonFileName);
    fs.unlinkSync(csvFileName);
  
    const messages = uniqueElements.map((element) => {
      return {
        id: element.id || '',
        review: element.review || '',
        date: element.date || '',
        response: element.response || '',
        responseTime: element.responseTime || '',
        imageUrls: element.imageUrls || [],
        rating: element.rating || 0,
        qa: element.qa || [],
        user: element.user || {},
        csvUrl: `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/csv/${pushId}.csv`,
        jsonUrl: `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/json/${pushId}.json`
      };
    });
    await batchWriteLargeArray(uid, pushId, messages);
  
    await updateReview(uid, pushId, {
      status: 'completed',
      totalReviews: uniqueElements.length,
      completedAt: new Date()
    });

    const currentUser = await getUser(uid);
    const coinBalance = currentUser.data().coinBalance || 0;
    const newCoinBalance = coinBalance - uniqueElements.length;

    await updateUser(uid, {
      lastScraped: new Date(),
      coinBalance: newCoinBalance
    });

    await createUserUsage(uid, {
      title,
      pushId,
      url,
      createdAt: new Date(),
      spentCoins: uniqueElements.length
    });
  
    return uniqueElements;
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Export the main function for Google Cloud Functions
module.exports = main;
