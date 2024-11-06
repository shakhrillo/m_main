const extractImageUrlsFromButtons = require("./extractImageUrlsFromButtons");
const extractQuestions = require("./extractQuestions");
const extractReviewer = require("./extractReviewer");
const extractReviewRating = require("./extractReviewRating");
const extractReviewText = require("./extractReviewText");
const getOwnerResponse = require("./getOwnerResponse");
const { getOwnerResponseTime } = require("./getOwnerResponseTime");
const getReviewDate = require("./getReviewDate");
const logger = require("./logger");
const wait = require("./wait");

/**
 * Retrieves review elements from a given review container starting from the last fetched review ID.
 * It collects various details about each review including text, date, owner response, images, rating,
 * questions, and the reviewer information.
 *
 * @param {Object} page - The Puppeteer page instance.
 * @param {Object} reviewContainer - The container element that holds review elements.
 * @param {string|null} lastFetchedReviewId - The ID of the last fetched review to continue from. 
 *                                             If null, fetching starts from the beginning.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of new review elements,
 *                                      where each element contains detailed information about the review.
 */
async function getReviewElements(page, reviewContainer, lastFetchedReviewId) {
  const newReviewElements = [];

  /**
   * Fetches details of a specific review element.
   *
   * @param {Object} reviewElement - The individual review element.
   * @param {string} reviewId - The ID of the review.
   * @returns {Promise<Object>} - A promise that resolves to an object containing review details.
   */
  const fetchReviewDetails = async (reviewElement, reviewId) => {
    try {
      const buttons = await reviewElement.$$(`
        button[data-review-id="${reviewId}"][jsaction*="review.expandReview"],
        button[jsaction*="review.showReviewInOriginal"],
        button[jsaction*="review.expandOwnerResponse"],
        button[jsaction*="review.showOwnerResponseInOriginal"]
      `);

      for (const button of buttons) {
        const isButtonInViewport = await button.isIntersectingViewport();
        if (!isButtonInViewport) {
          await button.scrollIntoView();
        }
        await button.click(); // Click to expand the review
        // await wait(40); // Wait for any animations or loading
      }

      const result =  {
        id: reviewId,
        element: reviewElement,
        review: await extractReviewText(reviewElement),
        date: await getReviewDate(reviewElement, reviewId),
        response: await getOwnerResponse(reviewElement),
        responseTime: await getOwnerResponseTime(reviewElement),
        imageUrls: await extractImageUrlsFromButtons(page, reviewId),
        rating: await extractReviewRating(reviewElement, reviewId),
        qa: await extractQuestions(reviewElement),
        user: await extractReviewer(reviewElement, reviewId)
      };

      return result;
    } catch (error) {
      logger.error('Error in fetchReviewDetails:', error);
      return null; // Return null or handle error as needed
    }
  };

  try {
    const reviewContainerChildren = await reviewContainer.$$(':scope > *');
    const secondLastChild = reviewContainerChildren[reviewContainerChildren.length - 2];

    if (!secondLastChild) {
      logger.warn('Second last child not found');
      return newReviewElements; // Return empty if no valid child
    }

    const secondLastChildDescendants = await secondLastChild.$$(':scope > *');
    let shouldFetchNewElements = true; // Start fetching elements

    for (const childElement of secondLastChildDescendants) {
      const reviewId = await childElement.evaluate(el => el.getAttribute('data-review-id'));
      if (!reviewId) continue; // Skip if there's no review ID

      if (reviewId === lastFetchedReviewId) {
        shouldFetchNewElements = false; // Stop fetching once last fetched ID is reached
        continue;
      }

      if (shouldFetchNewElements) {
        const reviewDetails = await fetchReviewDetails(childElement, reviewId);
        if (reviewDetails) newReviewElements.push(reviewDetails); // Only push if details are valid
      }
    }
  } catch (error) {
    logger.error('Error in getReviewElements:', error);
  }

  return newReviewElements; // Return the array of new review elements
}

module.exports = getReviewElements;