const logger = require("../config/logger");
const wait = require("./wait");

const waitForReviewData = async (page, reviewsContainer, timeout = 30000) => {
  try {
    const startTime = Date.now(); // Record the start time
    let dataIsValid = false;

    logger.info("Waiting for review data to load...");

    while (!dataIsValid) {
      // Check for timeout
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > timeout) {
        logger.error(
          `Timeout reached after ${timeout}ms while waiting for review data.`
        );
        throw new Error("Timeout waiting for review data");
      }

      // const el = await page.$(".vyucnb");
      // if (!el) {
      //   logger.info("Element not found");
      //   return [];
      // }
      // const reviewsContainer =
      const reviewContainerChildren = await reviewsContainer.$$(":scope > *");
      const secondLastChild =
        reviewContainerChildren[reviewContainerChildren.length - 2];
      const beforeLastChildChildren = await secondLastChild.$$(":scope > *");

      logger.info("Children of before last child:", beforeLastChildChildren);

      // Ensure valid structure and check `data-review-id` attributes
      if (beforeLastChildChildren && beforeLastChildChildren.length > 0) {
        // const result = beforeLastChildChildren;
        const result = [];
        for (const child of beforeLastChildChildren) {
          if (!child) {
            logger.info("Child not found");
            // skip the iteration
            continue;
          }
          const reviewId = await page.evaluate(
            (el) => el.getAttribute("data-review-id"),
            child
          );
          if (reviewId) {
            logger.info(`Review ID: ${reviewId}`);
            result.push(reviewId);
          }
        }
        dataIsValid = true;
        logger.info(
          `Review data successfully validated with ${result.length} items.`
        );
        return result; // Return the validated data
      }

      // Log progress and wait before re-evaluating
      logger.debug("Review data not yet valid, retrying...");
      await wait(1000); // Throttle retries to avoid excessive DOM queries
    }
  } catch (error) {
    logger.error("Error in waitForReviewData:", error);
    throw error; // Rethrow the error to handle upstream
  }
};

module.exports = waitForReviewData;
