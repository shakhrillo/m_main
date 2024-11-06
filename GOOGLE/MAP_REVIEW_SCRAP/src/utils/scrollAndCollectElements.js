const wait = require('./wait');
const { updateReview } = require('../controllers/reviewController');
const checkInfiniteScroll = require('./checkInfiniteScroll');
const getReviewElements = require('./getReviewElements');
const getReviewsContainer = require('./getReviewsContainer');
const filterUniqueElements = require('./filter');

/**
 * Scrolls through a page to collect review elements up to a specified limit.
 * 
 * @param {Page} page - The Puppeteer page object representing the current web page.
 * @param {string} uid - The user ID for tracking purposes.
 * @param {string} pushId - The push notification ID for updates.
 * @param {number} [limit=50] - The maximum number of review elements to collect.
 * @returns {Promise<Array>} - A promise that resolves to an array of collected review elements.
 */
async function scrollAndCollectElements(page, uid, pushId, limit) {
  const reviewsContainer = await getReviewsContainer(page);
  if (!reviewsContainer) {
    console.error('Reviews container not found');
    return [];
  }

  let isScrollFinished = false;
  let allElements = [];
  let lastId = null;

  const startTimestamp = Date.now();
  let lastLoggedTime = 0;
  let scrollCount = 0;

  while (!isScrollFinished) {
    scrollCount++;

    // wait 5 sec for each 30 scrolls and clear cache
    if (scrollCount % 30 === 0) {
      console.log('Clearing cache...');
      try {
        await page.evaluate(() => {
          caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
          });
        });
      
        await page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
      
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        await client.send('Network.clearBrowserCache');
        await wait(5000);
        console.log('Cache cleared');
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }

    try {
      const { lastChild, completed } = await checkInfiniteScroll(reviewsContainer);
      lastId = allElements[allElements.length - 1]?.id;
      
      const updatedTimestamp = Date.now();
      const spentInMinutes = (updatedTimestamp - startTimestamp) / 1000 / 60;
      
      let elements = [];
      try {
        elements = await getReviewElements(page, reviewsContainer);
      } catch (error) {
        console.error('Error getting review elements:', error);
      }
      allElements.push(...elements);
      const uniqueElements = filterUniqueElements(allElements) || [];

      if (uniqueElements.length >= limit) {
        isScrollFinished = true;
        console.info('Limit reached, stopping scroll');
        break;
      }

      // Console log every 15 seconds
      if (Math.floor(spentInMinutes * 4) > lastLoggedTime) {
        lastLoggedTime = Math.floor(spentInMinutes * 4);
        console.log('Spent:', spentInMinutes, 'minutes');
        console.log('All elements:', allElements.length);
        await updateReview(uid, pushId, {
          extractedReviews: allElements.length,
          spentInMinutes,
        });
      }

      if (completed) {
        isScrollFinished = true;
        console.info('Scrolling completed, all elements collected');
        break;
      }

      if (elements.length > 0) {
        const reviewContainerChildren = await reviewsContainer.$$(':scope > *');
        const secondLastChild = reviewContainerChildren[reviewContainerChildren.length - 2];
        const secondLastChildDescendants = await secondLastChild.$$(':scope > *');
        for (let i = 0; i < secondLastChildDescendants.length; i++) {
          if (i !== getReviewElements.length - 1) {
            await page.evaluate(el => el.remove(), secondLastChildDescendants[i]);
          }
        }
      }

      // scroll top .vyucnb
      await page.evaluate(() => {
        const el = document.querySelector('.vyucnb');
        if (el) el.scrollIntoView();
      });
      await wait(100);

      // scroll bottom .vyucnb
      await page.evaluate(() => {
        const el = document.querySelector('.vyucnb');
        const nextEl = el.nextElementSibling;
        if (nextEl) nextEl.scrollIntoView();
      });
      
      await wait(100);
      
      if (lastChild) {
        const isLastChildInViewport = await lastChild.isIntersectingViewport();
        if (!isLastChildInViewport) {
          await page.evaluate(el => el.scrollIntoView(), lastChild);
        }
      }

      await wait(100); // Wait for a short duration to allow more reviews to load
    } catch (error) {
      console.error('Error scrolling and collecting elements:', error);
      isScrollFinished = true; // Exit the loop on error
    }
  }

  return allElements;
}

exports.scrollAndCollectElements = scrollAndCollectElements;
