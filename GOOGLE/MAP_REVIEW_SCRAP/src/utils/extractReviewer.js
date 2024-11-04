const logger = require('./logger');

/**
 * Extracts the reviewer's information from a review element on the given page.
 * 
 * @param {Page} page - The Puppeteer page object representing the current web page.
 * @param {string} reviewId - The ID of the review from which to extract the reviewer information.
 * @returns {Promise<{name: string, info: string[], href: string, content: string[]}>} 
 * - A promise that resolves to an object containing the reviewer's name, info, href, and content or null if no reviewer is found.
 */
async function extractReviewer(page, reviewId) {
  try {
    // Locate the reviewer button using the review ID
    const reviewerButton = await page.$$(`button[jsaction*="review.reviewerLink"][data-review-id="${reviewId}"]`);
    if (!reviewerButton.length) {
      logger.warn(`No reviewer button found for review ID: ${reviewId}`);
      return null; // Return null if no reviewer button is found
    }

    const results = {
      name: '',
      info: [],
      href: '',
      content: [],
    };

    // Extract information from the reviewer button(s)
    for (const button of reviewerButton) {
      const { href, content } = await button.evaluate(el => {
        const href = el.getAttribute('data-href');
        const content = el.innerText.split('\n');

        return { href, content };
      });

      results.name = content[0] || ''; // Set the reviewer's name
      results.info = (content[1] || '').split('·').map(item => item.trim()); // Parse info into an array
      results.href = href; // Set the href
      results.content = content; // Set the content array
    }

    return results;
  } catch (error) {
    logger.error('Error extracting reviewer information:', error);
    return null; // Return null on error
  }
}

module.exports = extractReviewer;