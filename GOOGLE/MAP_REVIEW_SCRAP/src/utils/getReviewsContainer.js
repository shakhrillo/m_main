const puppeteer = require("puppeteer");
const logger = require("../config/logger");

/**
 * Retrieves the parent element of the first reviews container from the specified page.
 *
 * This function waits for the reviews container to load on the page. If the container does not load
 * within the specified timeout, it logs an error and returns null. If the container is found, the function
 * returns its parent element.
 *
 * @param {puppeteer.Page} page - The Puppeteer page instance to interact with.
 * @param {number} [timeout=5000] - The maximum time (in milliseconds) to wait for the reviews container.
 * @param {number} [retries=3] - Number of retry attempts if the container is not found initially.
 * @returns {Promise<puppeteer.JSHandle | null>} - A Promise that resolves to the parent element of the reviews container,
 * or null if the container is not found after retries.
 */
async function getReviewsContainer(page, timeout = 5000, retries = 3) {
  logger.info("Attempting to retrieve reviews container...");

  const reviewsSelector = ".vyucnb";
  let attempt = 0;

  while (attempt < retries) {
    attempt++;
    try {
      logger.info(`Attempt ${attempt} to locate reviews container...`);

      // Wait for the reviews container to load
      await page.waitForSelector(reviewsSelector, { timeout });
      logger.info("Reviews container found");

      // Retrieve all elements matching the reviews selector
      const vyucnb = await page.$$(reviewsSelector);

      if (vyucnb.length > 0) {
        logger.info(
          "Retrieving parent element of the first reviews container..."
        );

        // Get the parent element of the first reviews container
        const parentElm = await page.evaluateHandle(
          (el) => el.parentElement,
          vyucnb[0]
        );

        if (parentElm) {
          logger.info("Parent element successfully retrieved.");
          return parentElm;
        } else {
          logger.error("Failed to retrieve the parent element.");
        }
      } else {
        logger.warn("No reviews containers found.");
      }
    } catch (error) {
      logger.error(`Attempt ${attempt} failed: ${error.message}. Retrying...`);
    }
  }

  logger.error(
    `All ${retries} attempts to locate the reviews container have failed.`
  );
  return null;
}

module.exports = getReviewsContainer;
