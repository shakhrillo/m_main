const extractImageUrlsFromButtons = require("./extractImageUrlsFromButtons");
const extractQuestions = require("./extractQuestions");
const extractReviewer = require("./extractReviewer");
const extractReviewRating = require("./extractReviewRating");
const extractReviewText = require("./extractReviewText");
const getOwnerResponse = require("./getOwnerResponse");
const { getOwnerResponseTime } = require("./getOwnerResponseTime");
const getReviewDate = require("./getReviewDate");

const fetchReviewDetails = async (page, reviewId) => {
  try {
    const reviewElement = await page.$(`[data-review-id="${reviewId}"]`);
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
      // element: reviewElement,
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
    console.error('Error in fetchReviewDetails:', error);
    return null; // Return null or handle error as needed
  }
};

module.exports = fetchReviewDetails;