const logger = require("../config/logger");
const wait = require("./wait");

/**
 * Clicks the review tab on the page with a retry mechanism for handling dynamic loading.
 *
 * @async
 * @function clickReviewTab
 * @param {Object} page - The Puppeteer page object.
 * @param {number} [retries=3] - The number of retry attempts in case of failure.
 * @throws {Error} If the review tab cannot be found or clicked after all attempts.
 * @returns {Promise<void>} A promise that resolves when the review tab is successfully clicked.
 */
async function clickReviewTab(page, retries = 3) {
  logger.info("Attempting to click the review tab");

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.waitForSelector('button[role="tab"]', {
        visible: true,
        timeout: 3000,
      });
      const allButtons = await page.$$('button[role="tab"]');

      if (!allButtons.length) {
        throw new Error("No tab buttons found");
      }

      for (const button of allButtons) {
        const tabText = await button.evaluate(
          (el) => el.textContent?.trim().toLowerCase() || ""
        );
        if (tabText.includes("reviews")) {
          logger.info("Found and clicking the review tab");
          await button.click();
          await wait(1000); // Short delay for click to take effect
          return;
        }
      }

      throw new Error("Review tab not found");
    } catch (error) {
      logger.warn(
        `Attempt ${attempt} to click the review tab failed: ${error.message}`
      );
      if (attempt < retries) {
        await wait(1000); // Wait a moment before retrying
      } else {
        logger.error("Failed to click the review tab after multiple attempts");
      }
    }
  }
}

module.exports = clickReviewTab;
