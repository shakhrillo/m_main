const puppeteer = require('puppeteer');
const logger = require('./logger');

/**
 * Retrieves the parent element of the first reviews container from the specified page.
 *
 * This function waits for the reviews container to load on the page. If the container does not load
 * within the specified timeout, it logs an error and returns null. If the container is found, the function
 * returns its parent element.
 *
 * @param {puppeteer.Page} page - The Puppeteer page instance to interact with.
 * @returns {Promise<puppeteer.JSHandle | null>} - A Promise that resolves to the parent element of the reviews container,
 * or null if the container is not found or did not load in time.
 */
async function getReviewsContainer(page) {
  logger.info('Getting reviews container');

  // Define the selector for the reviews container
  const reviewsSelector = '.vyucnb';

  try {
    // Wait for the reviews container to load within the specified timeout
    await page.waitForSelector(reviewsSelector, { timeout: 5000 });
  } catch (error) {
    // Log error if the container does not load in time
    logger.error('Reviews container did not load in time: ' + error.message);
    return null;
  }

  // Retrieve all elements matching the reviews selector
  const vyucnb = await page.$$(reviewsSelector);
  let parentElm = null;

  // Check if any reviews containers were found
  if (vyucnb.length > 0) {
    // Get the parent element of the first reviews container
    parentElm = await page.evaluateHandle(el => el.parentElement, vyucnb[0]);
  } else {
    // Log error if no reviews container was found
    logger.error('No reviews container found');
  }

  return parentElm; // Return the parent element or null if not found
}

module.exports = getReviewsContainer;