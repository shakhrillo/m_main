const extractImageUrlsFromButtons = require("./extractImageUrlsFromButtons");
const extractQuestions = require("./extractQuestions");
const extractReviewer = require("./extractReviewer");
const extractReviewRating = require("./extractReviewRating");
const extractReviewText = require("./extractReviewText");
const getOwnerResponse = require("./getOwnerResponse");
const { getOwnerResponseTime } = require("./getOwnerResponseTime");
const getReviewDate = require("./getReviewDate");
const wait = require("./wait");

const fetchReviewDetails = async (page, reviewId) => {
  try {
    let isPageOpen = page.isClosed();
    if (isPageOpen) {
      console.log("The page has been closed, stopping further actions.");
      return null;
    }

    await page.waitForSelector(`.jftiEf[data-review-id="${reviewId}"]`);
    let reviewElement = await page.$$(`.jftiEf[data-review-id="${reviewId}"]`);
    if (reviewElement.length === 0) {
      console.log(`Review with ID ${reviewId} not found`);
      return null;
    }
    reviewElement = reviewElement[0];
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

      let attempts = 3;
      while (attempts > 0) {
        if (await button.evaluate((el) => el.isConnected)) {
          try {
            await button.click();
            break; // Exit loop if click succeeds
          } catch (error) {
            console.log("Retrying click...");
            await wait(200);
          }
        } else {
          console.log("Button is not connected to the DOM");
          break; // Exit if button is detached
        }
        attempts--;
      }

      // if (await button.evaluate((el) => el.isConnected)) {
      //   // check Node is either not clickable or not an Element
      //   if (!button.click || !button.asElement()) {
      //     console.log("Button is not clickable or not an Element");
      //     // skip
      //     continue;
      //   }
      //   await button.click(); // Click to expand the review
      //   await wait(200); // Wait for any animations or loading
      // }
    }

    isPageOpen = page.isClosed();
    if (isPageOpen) {
      console.log("The page has been closed, stopping further actions.");
      return null;
    }

    const result = {
      id: reviewId,
      // element: reviewElement,
      review: await extractReviewText(reviewElement),
      date: await getReviewDate(reviewElement, reviewId),
      response: await getOwnerResponse(reviewElement),
      responseTime: await getOwnerResponseTime(reviewElement),
      imageUrls: await extractImageUrlsFromButtons(page, reviewId),
      rating: await extractReviewRating(reviewElement, reviewId),
      qa: await extractQuestions(reviewElement),
      user: await extractReviewer(reviewElement, reviewId),
    };

    return result;
  } catch (error) {
    console.error("Error in fetchReviewDetails:", error);
    return null; // Return null or handle error as needed
  }
};

module.exports = fetchReviewDetails;
