// const logger = require('./logger');

/**
 * Extracts the rating of a review from the given review element.
 *
 * @param {ElementHandle} element - The review element from which to extract the rating.
 * @param {string} reviewId - The ID of the review to assist in finding the rating.
 * @returns {Promise<string>} - A promise that resolves to the review rating text or an empty string if no rating is found.
 */
async function extractReviewRating(element, reviewId) {
  let ratingText = "";

  try {
    // Attempt to locate the rating element within the review
    let ratingElement = await element.$$(
      'span[role="img"][aria-label*="stars"]'
    );
    if (ratingElement.length > 0) {
      ratingElement = ratingElement[0];
    }
    if (ratingElement) {
      // Extract and return the rating from the aria-label attribute
      ratingText = await ratingElement.evaluate((el) => {
        if (!el) return "";
        return el.getAttribute("aria-label") || "";
      });
      return ratingText;
    }

    // If no rating element is found, check for the thumbs up button
    let thumbsUpButton = await element.$$(
      `button[data-review-id="${reviewId}"][jsaction*="review.toggleThumbsUp"]`
    );
    if (thumbsUpButton.length > 0) {
      thumbsUpButton = thumbsUpButton[0];
    }
    if (!thumbsUpButton) {
      // logger.warn(`No thumbs up button found for review ID: ${reviewId}`);

      // Attempt to access the first child element to find the rating
      const firstChildElement = await element.evaluateHandle((el) => {
        if (!el) return;
        if (!el.firstElementChild) return;
        if (!el.firstElementChild.firstElementChild) return;
        if (!el.firstElementChild.firstElementChild.lastElementChild) return;
        if (
          !el.firstElementChild.firstElementChild.lastElementChild
            .firstElementChild
        )
          return;
        return el?.firstElementChild?.firstElementChild?.lastElementChild
          ?.firstElementChild;
      });

      if (!firstChildElement) {
        // logger.warn('First child element not found.');
        return ""; // Return empty if no first child element is found
      }

      // Check for span elements in the first child element
      const spanElements = await firstChildElement.$$("span");
      if (!spanElements || spanElements.length < 2) {
        // logger.warn('Not enough span elements found to determine rating.');
        return ""; // Return empty if not enough span elements are found
      }

      // Return the inner text of the first span element
      return await spanElements[0].evaluate((el) => {
        if (!el) return "";
        return el.innerText;
      });
    }

    // If thumbs up button exists, access the second child element for the rating
    const secondChildElement = await thumbsUpButton.evaluateHandle((el) => {
      if (!el) return;
      if (!el.parentElement) return;
      if (!el.parentElement.parentElement) return;
      const parentElement = el.parentElement?.parentElement;
      if (!parentElement) return;
      if (!parentElement.firstElementChild) return;
      return parentElement?.firstElementChild?.children[0];
    });

    if (!secondChildElement) {
      // logger.warn('Second child element not found from thumbs up button.');
      return ""; // Return empty if no second child element is found
    }

    // Return the inner text of the second child element
    return await secondChildElement.evaluate((el) => {
      if (!el) return "";
      return el.innerText;
    });
  } catch (error) {
    // logger.error('Error extracting review rating:', error);
    return ""; // Return empty on error
  }
}

module.exports = extractReviewRating;
