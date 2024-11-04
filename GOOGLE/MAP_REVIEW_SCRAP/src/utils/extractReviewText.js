const logger = require('./logger');

/**
 * Extracts the text of a review from a review element.
 * 
 * @param {ElementHandle} element - The review element from which to extract the text.
 * @returns {Promise<string>} - A promise that resolves to the review text or an empty string if no review text is found.
 */
async function extractReviewText(element) {
  let reviewTextContent = '';

  try {
    // Locate the review container
    const reviewContainer = await element.$$('.MyEned');
    if (!reviewContainer.length) {
      logger.warn('No review containers found in the provided element.');
      return reviewTextContent; // Return empty if no review containers are found
    }

    // Extract the review text from the first review container
    const reviewText = await reviewContainer[0].$('span');
    if (!reviewText) {
      logger.warn('No review text element found in the review container.');
      return reviewTextContent; // Return empty if no review text element is found
    }

    // Retrieve the text content of the review
    reviewTextContent = await reviewText.evaluate(el => el.textContent.trim());
  } catch (error) {
    logger.error('Error extracting review text:', error);
  }

  return reviewTextContent;
}

module.exports = extractReviewText;