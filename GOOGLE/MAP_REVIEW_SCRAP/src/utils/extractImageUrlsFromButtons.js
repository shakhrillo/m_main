const logger = require('./logger');

/**
 * Extracts image URLs from buttons associated with a specific review.
 * 
 * @param {Page} page - The Puppeteer page object from which to extract image URLs.
 * @param {string} reviewId - The ID of the review for which to extract image URLs.
 * @returns {Promise<string[]>} - A promise that resolves to an array of extracted image URLs.
 */
async function extractImageUrlsFromButtons(page, reviewId) {
  const extractedImageUrls = [];

  try {
    // Select all buttons that match the given review ID and the action to open photos
    const allButtons = await page.$$(`button[data-review-id="${reviewId}"][jsaction*="review.openPhoto"]`);
    if (allButtons.length === 0) {
      logger.warn(`No buttons found for review ID: ${reviewId}`);
      return extractedImageUrls; // Return empty array if no buttons are found
    }

    // Iterate over each button to extract the image URL
    for (const button of allButtons) {
      const imageUrl = await button.evaluate(el => {
        const style = el.getAttribute('style');
        if (style) {
          const urlMatch = style.split('url("')[1]?.split('");')[0];
          if (urlMatch) {
            return urlMatch.split('=')[0] + '=w1200'; // Resize the image URL
          }
        }
        return null; // Return null if no valid image URL is found
      });

      if (imageUrl) {
        extractedImageUrls.push(imageUrl);
      }
    }
  } catch (error) {
    logger.error('Error extracting image URLs from buttons:', error);
  }

  return extractedImageUrls;
}

module.exports = extractImageUrlsFromButtons;