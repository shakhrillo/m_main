const logger = require('./logger');

/**
 * Retrieves the owner's response to a review from a review element.
 * 
 * @param {ElementHandle} reviewElement - The review element from which to extract the owner's response.
 * @returns {Promise<string>} - A promise that resolves to the owner's response text or an empty string if no response is found.
 */
async function getOwnerResponse(reviewElement) {
  let ownerResponse = '';

  try {
    // Find the star rating element within the review
    const starRating = await reviewElement.$('span[role="img"][aria-label*="stars"]');
    if (!starRating) {
      logger.warn('Star rating not found in the review element.');
      return ownerResponse; // Return empty if no star rating is found
    }

    // Navigate to the container holding the review details
    const reviewContainer = await starRating.evaluateHandle(el => el.parentElement.parentElement);
    if (!reviewContainer) {
      logger.warn('Review container not found.');
      return ownerResponse; // Return empty if review container is not found
    }

    // Find the response section in the review container
    const responseSection = await reviewContainer.evaluateHandle(el => el.lastElementChild);
    if (!responseSection) {
      logger.warn('Response section not found.');
      return ownerResponse; // Return empty if response section is not found
    }

    // Check if this section includes the "Response from the owner" text
    const responseSectionText = await responseSection.evaluate(el => el.textContent);
    if (responseSectionText.includes('Response from the owner')) {
      const responseContentDivs = await responseSection.$$('div');
      
      // Check if response content is available
      if (responseContentDivs.length > 1) {
        const responseContent = responseContentDivs[1];
        ownerResponse = await responseContent.evaluate(el => el.textContent.trim());
      } else {
        logger.warn('Response content divs not found.');
      }
    }
  } catch (error) {
    logger.error('Error retrieving owner response:', error);
  }

  return ownerResponse;
}


module.exports = getOwnerResponse;