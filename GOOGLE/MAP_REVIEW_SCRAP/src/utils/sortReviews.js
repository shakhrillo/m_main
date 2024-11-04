const logger = require("./logger");
const wait = require("./wait");

/**
 * Sorts the reviews on a page based on the specified criteria.
 *
 * @async
 * @function sortReviews
 * @param {Object} page - The Puppeteer page object.
 * @param {string} [sortBy='Newest'] - The sorting criteria (e.g., 'Newest', 'Most relevant').
 * @throws {Error} If the sort button or the specified sort option is not found.
 * @returns {Promise<void>} A promise that resolves when the sorting is complete.
 */
async function sortReviews(page, sortBy = 'Newest') {
  try {
    // Attempt to find the sort button
    const sortButton = await page.$('button[aria-label="Sort reviews"], button[aria-label="Most relevant"]');
    if (!sortButton) {
      throw new Error('Sort button not found');
    }
    
    // Click the sort button and wait for the menu to appear
    await sortButton.click();
    await wait(1000);

    const menuItemRadios = await page.$$('[role="menuitemradio"]');
    let foundNewest = false;
    
    for (const menuItem of menuItemRadios) {
      const text = await page.evaluate(el => el.textContent.trim(), menuItem);
      
      if (text === sortBy) {
        logger.info(`Selecting ${sortBy} reviews`);
        await menuItem.click();
        foundNewest = true;
        break;
      }
    }

    if (!foundNewest) {
      throw new Error('Newest menu item not found');
    }
    
    // Confirm the "Newest" option is selected (optional)
    await page.waitForSelector('[aria-checked="true"]', { timeout: 2000 });
    
    logger.info('Successfully selected newest reviews');
  } catch (error) {
    logger.error('Failed to select newest reviews:', error.message);
    throw error;
  }
}


module.exports = sortReviews;