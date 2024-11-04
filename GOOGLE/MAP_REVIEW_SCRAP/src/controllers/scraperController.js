const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { uploadFile } = require('../services/storageService');
const wait = require('../utils/wait');
const { launchBrowser, openPage } = require('../utils/browser');
const filterUniqueElements = require('../utils/filter');
const { batchWriteLargeArray, updateReview } = require('./reviewController');
const { getUser, updateUser, createUserUsage } = require('./userController');
const clickReviewTab = require('../utils/clickReviewTab');
const sortReviews = require('../utils/sortReviews');
const enableRequestInterception = require('./enableRequestInterception');
const { scrollAndCollectElements } = require('../utils/scrollAndCollectElements');
const { firestore } = require('../services/firebaseAdmin');

// Define a temporary directory in your project (e.g., ./temp)
const tempDir = path.join(__dirname, 'temp');

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function main(url, uid, pushId, limit=50, sortBy='Lowest rating') {
  try {
    const browser = await launchBrowser();  
    const page = await openPage(browser, url);
    const title = await page.title();

    await updateReview(uid, pushId, {
      title,
      createdAt: new Date(),
      status: 'in-progress',
      token: ''
    });

    await enableRequestInterception(page, [
      'googleusercontent',
      'preview',
      'analytics',
      'ads',
      'fonts',
      '/maps/vt'
    ]);

    await clickReviewTab(page);
    await sortReviews(page, sortBy);
  
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
      csvUrl: `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/csv/${pushId}.csv`,
      jsonUrl: `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/json/${pushId}.json`,
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

    const statusDoc = firestore.doc(`status/app`);
    const statusSnapshot = await statusDoc.get();
    if (!statusSnapshot.exists) {
      await statusDoc.set({
        active: false,
      });
    } else {
      statusDoc.update({
        active: false,
      });
    }
  
    return uniqueElements;
  } catch (error) {
    console.error('Error occurred:', error);
    const statusDoc = firestore.doc(`status/app`);
    const statusSnapshot = await statusDoc.get();
    if (!statusSnapshot.exists) {
      await statusDoc.set({
        active: false,
      });
    } else {
      statusDoc.update({
        active: false,
      });
    }
  }
}

// Export the main function for Google Cloud Functions
module.exports = main;
