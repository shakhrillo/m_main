const logger = require("../config/logger");
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
      return {};
    }

    try {
      // scroll to view
      await page.evaluate((reviewId) => {
        const reviewElement = document.querySelector(
          `.jftiEf[data-review-id="${reviewId}"]`
        );
        if (!reviewElement) {
          log(`Review with ID ${reviewId} not found`);
          return;
        }
        reviewElement.scrollIntoView();
      });
    } catch (error) {
      console.log(`Review with ID ${reviewId} not found`);
      return {};
    }

    let reviewElement = await page.$$(`.jftiEf[data-review-id="${reviewId}"]`);
    if (reviewElement.length === 0) {
      console.log(`Review with ID ${reviewId} not found`);
      return {};
    }
    reviewElement = reviewElement[0];
    const buttons = await reviewElement.$$(`
      button[data-review-id="${reviewId}"][jsaction*="review.expandReview"],
      button[jsaction*="review.showReviewInOriginal"],
      button[jsaction*="review.expandOwnerResponse"],
      button[jsaction*="review.showOwnerResponseInOriginal"]
    `);

    let isFailed = false;
    // for (const button of buttons) {
    //   let attempts = 3;
    //   while (attempts > 0) {
    //     if (
    //       button &&
    //       (await button.evaluate((el) => {
    //         if (!el) return false;
    //         return el.isConnected;
    //       }))
    //     ) {
    //       try {
    //         const isButtonInViewport = await button.isIntersectingViewport();
    //         if (!isButtonInViewport) {
    //           await button.scrollIntoView();
    //         }
    //         await button.click();
    //         break; // Exit loop if click succeeds
    //       } catch (error) {
    //         console.log("Retrying click...");
    //         await wait(200);
    //       }
    //     } else {
    //       console.log("Button is not connected to the DOM");
    //       isFailed = true;
    //       break; // Exit if button is detached
    //     }
    //     attempts--;
    //   }
    // }

    // if (isFailed) {
    //   console.log("Failed to click on the buttons");
    //   page.evaluate(() => {
    //     log("Scrolling to the top of the page");
    //     if (!document.querySelector(".vyucnb")) {
    //       log("No .vyucnb element found");
    //     } else {
    //       document
    //         .querySelector(".vyucnb")
    //         .parentElement.firstElementChild.scrollIntoView();
    //       setTimeout(() => {
    //         log("Scrolling to the bottom of the page");
    //         document
    //           .querySelector(".vyucnb")
    //           .parentElement.lastChild.scrollIntoView();
    //       });
    //     }
    //   });
    //   return {};
    // }

    // isPageOpen = page.isClosed();
    // if (isPageOpen) {
    //   console.log("The page has been closed, stopping further actions.");
    //   return null;
    // }

    let result = {};
    try {
      result = {
        id: reviewId,
        element: reviewElement,
        review: await extractReviewText(reviewElement),
        // date: await getReviewDate(reviewElement, reviewId),
        // response: await getOwnerResponse(reviewElement),
        // responseTime: await getOwnerResponseTime(reviewElement),
        // imageUrls: await extractImageUrlsFromButtons(page, reviewId),
        // rating: await extractReviewRating(reviewElement, reviewId),
        // qa: await extractQuestions(reviewElement),
        // user: await extractReviewer(reviewElement, reviewId),
      };
    } catch (error) {
      console.error("Error in extracting review details:", error);
    }

    await wait(1000);
    logger.info(`Review details fetched for review ID: ${reviewId}`);

    return result;
  } catch (error) {
    console.error("--> Error in fetchReviewDetails:", error);
    return {}; // Return null or handle error as needed
  }
};

module.exports = fetchReviewDetails;
