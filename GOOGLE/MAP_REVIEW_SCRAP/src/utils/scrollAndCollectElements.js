const logger = require('./logger');
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
    logger.error('Reviews container not found');
    return [];
  }

  let isScrollFinished = false;
  let allElements = [];
  let lastId = null;

  const startTimestamp = Date.now();
  let found = 0;

  while (!isScrollFinished) {
    try {
      const { lastChild, completed } = await checkInfiniteScroll(reviewsContainer);
      lastId = allElements[allElements.length - 1]?.id;
      
      const updatedTimestamp = Date.now();
      const spentInMinutes = (updatedTimestamp - startTimestamp) / 1000 / 60;
      
      console.log('Container children count:', found, 'Spent:', spentInMinutes, 'minutes');

      const elements = await getReviewElements(page, reviewsContainer);
      allElements.push(...elements);
      const uniqueElements = filterUniqueElements(allElements) || [];
      console.log('Unique elements:', uniqueElements.length);

      if (uniqueElements.length >= limit) {
        isScrollFinished = true;
        logger.info('Limit reached, stopping scroll');
        break;
      }

      await updateReview(uid, pushId, {
        extractedReviews: allElements.length,
      });

      if (completed) {
        isScrollFinished = true;
        logger.info('Scrolling completed, all elements collected');
        break;
      }

      const isLastChildInViewport = await lastChild.isIntersectingViewport();
      if (!isLastChildInViewport) {
        await page.evaluate(el => el.scrollIntoView(), lastChild);
      }

      const reviewContainerChildren = await reviewsContainer.$$(':scope > *');
      const secondLastChild = reviewContainerChildren[reviewContainerChildren.length - 2];
      const secondLastChildDescendants = await secondLastChild.$$(':scope > *');
      // remove half secondLastChildDescendants from node
      for (let i = 0; i < secondLastChildDescendants.length; i++) {
        await page.evaluate(el => el.remove(), secondLastChildDescendants[i]);
      }

      logger.info('Scrolling a little bit more');
      // scroll top .vyucnb
      await page.evaluate(() => {
        const el = document.querySelector('.vyucnb');
        if (el) el.scrollIntoView();
      });
      
      await wait(2000); // Wait for a short duration to allow more reviews to load
    } catch (error) {
      logger.error('Error scrolling and collecting elements:', error);
      isScrollFinished = true; // Exit the loop on error
    }
  }

  return allElements;
}

exports.scrollAndCollectElements = scrollAndCollectElements;
