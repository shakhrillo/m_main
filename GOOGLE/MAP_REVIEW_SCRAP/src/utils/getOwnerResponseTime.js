// const logger = require('./logger');

/**
 * Retrieves the date of the owner's response to a review from a review element.
 *
 * @param {ElementHandle} reviewElement - The review element from which to extract the owner's response date.
 * @returns {Promise<string>} - A promise that resolves to the owner's response date text or an empty string if no date is found.
 */
async function getOwnerResponseTime(reviewElement) {
  let ownerResponseDate = "";

  try {
    // Locate the star rating element
    let starRatingElement = await reviewElement.$$(
      'span[role="img"][aria-label*="stars"]'
    );
    if (starRatingElement.length > 0) {
      starRatingElement = starRatingElement[0];
    }
    if (!starRatingElement) {
      // logger.warn('Star rating element not found in the review element.');
      return ownerResponseDate; // Return empty if no star rating element is found
    }

    // Traverse up to locate the parent element that contains additional review details
    const reviewDetailContainer = await starRatingElement.evaluateHandle(
      (element) => {
        if (!element) return null;
        if (!element.parentElement) return null;

        return element.parentElement.parentElement;
      }
    );
    if (!reviewDetailContainer) {
      // logger.warn('Review detail container not found.');
      return ownerResponseDate; // Return empty if review detail container is not found
    }

    const responseContainer = await reviewDetailContainer.evaluateHandle(
      (element) => {
        if (!element) return null;
        return element.lastElementChild;
      }
    );

    if (!responseContainer) {
      // logger.warn('Response container not found.');
      return ownerResponseDate; // Return empty if response container is not found
    }

    // Check if this element contains the "Response from the owner" text
    const responseContainerText = await responseContainer.evaluate(
      (element) => {
        if (!element) return "";
        return element.textContent;
      }
    );
    if (responseContainerText.includes("Response from the owner")) {
      const responseTextElement = await responseContainer.evaluateHandle(
        (element) => {
          if (!element) return null;
          return element.firstElementChild;
        }
      );

      if (!responseTextElement) {
        // logger.warn('Response text element not found in the response container.');
        return ownerResponseDate; // Return empty if response text element is not found
      }

      // Retrieve the response date text
      ownerResponseDate = await responseTextElement.evaluate((element) => {
        if (!element) return "";
        return element.textContent;
      });
      ownerResponseDate =
        ownerResponseDate.split("Response from the owner")[1]?.trim() || ""; // Safely split and trim the response date
    } else {
      // logger.warn('Response from the owner not found in the response container.');
    }
  } catch (error) {
    // logger.error('Error retrieving owner response date:', error);
  }

  return ownerResponseDate;
}

exports.getOwnerResponseTime = getOwnerResponseTime;
