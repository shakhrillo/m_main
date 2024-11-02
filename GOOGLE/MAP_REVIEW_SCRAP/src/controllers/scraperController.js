const wait = require('../utils/wait');
const { launchBrowser, openPage } = require('../utils/browser');
const { clickReviewTab, scrollAndCollectElements } = require('../utils/elementUtils');
const filterUniqueElements = require('../utils/filter');
const { batchWriteLargeArray, updateReview } = require('./reviewController');

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
  
    const messages = allElements.map((element) => {
      return {
        id: element.id || '',
        review: element.review || '',
        date: element.date || '',
        response: element.response || '',
        responseTime: element.responseTime || '',
        imageUrls: element.imageUrls || [],
        rating: element.rating || 0,
        qa: element.qa || [],
        user: element.user || {}
      };
    });
    await batchWriteLargeArray(uid, pushId, messages);
  
    await updateReview(uid, pushId, {
      status: 'completed',
      totalReviews: uniqueElements.length,
      completedAt: new Date()
    });
  
    return uniqueElements;
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Export the main function for Google Cloud Functions
module.exports = main;
