/**
 * Extracts the date of a review from the given review element.
 *
 * @param {ElementHandle} element - The review element from which to extract the date.
 * @param {string} reviewId - The ID of the review to assist in finding the date.
 * @returns {Promise<string>} - A promise that resolves to the review date text or an empty string if no date is found.
 */
async function getReviewDate(element, reviewId) {
  let reviewDateText = "";

  try {
    // Attempt to locate the star rating element within the review
    let starRatingElement = await element.$$(
      'span[role="img"][aria-label*="stars"]'
    );
    if (starRatingElement.length > 0) {
      starRatingElement = starRatingElement[0];
    }

    if (starRatingElement) {
      // If found, get the next sibling element for the review date
      const reviewDateElement = await starRatingElement.evaluateHandle((el) => {
        if (!el) return null;
        return el.nextElementSibling;
      });
      if (!reviewDateElement) {
        logger.warn("Review date element not found.");
        return ""; // Return empty if no review date
      }
      reviewDateText = await reviewDateElement.evaluate((el) => {
        if (!el) return "";
        return el.innerText;
      });

      return reviewDateText;
    }

    // If no star rating element is found, check for the thumbs up button
    let thumbsUpButton = await element.$$(
      `button[data-review-id="${reviewId}"][jsaction*="review.toggleThumbsUp"]`
    );
    if (thumbsUpButton.length > 0) {
      thumbsUpButton = thumbsUpButton[0];
    }
    if (!thumbsUpButton) {
      // logger.warn(`No thumbs up button found for review ID: ${reviewId}`);

      // Attempt to access the first child element to find the review date
      const firstChild = await element.evaluateHandle(
        (el) =>
          el?.firstElementChild?.firstElementChild?.lastElementChild
            ?.firstElementChild
      );

      if (!firstChild) {
        // logger.warn('First child element not found.');
        return ""; // Return empty if no first child element is found
      }

      // Check for span elements in the first child element
      const secondChildDiv = await firstChild.$$("span");
      if (!secondChildDiv || secondChildDiv.length < 2) {
        // logger.warn('Not enough span elements found to determine review date.');
        return ""; // Return empty if not enough span elements are found
      }

      // Return the inner text of the second span element as the review date
      return await secondChildDiv[1].evaluate((el) => el.innerText);
    }

    // If thumbs up button exists, access the second child element for the review date
    const secondChild = await thumbsUpButton.evaluateHandle((el) => {
      const parent = el.parentElement?.parentElement;
      return parent?.firstElementChild?.children[1];
    });

    if (!secondChild) {
      // logger.warn('Second child element not found from thumbs up button.');
      return ""; // Return empty if no second child element is found
    }

    // Return the inner text of the second child element as the review date
    return await secondChild.evaluate((el) => el.innerText);
  } catch (error) {
    // logger.error('Error extracting review date:', error);
    return ""; // Return empty on error
  }
}

module.exports = getReviewDate;
