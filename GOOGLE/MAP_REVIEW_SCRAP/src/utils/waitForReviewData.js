const logger = require("../config/logger");
const wait = require("./wait");

const waitForReviewData = async (page) => {
  try {
    // await page.waitForSelector(".vyucnb"); // Wait for the selector to be available on the page

    let dataIsValid = false;
    while (!dataIsValid) {
      const result = await page.evaluate(() => {
        const el = document.querySelector(".vyucnb");
        if (!el) return false; // Guard in case the element disappears

        const reviewsContainer = el.parentElement;
        const lastChild = reviewsContainer?.lastChild;
        const beforeLastChild = lastChild?.previousSibling;

        // Check last child's children length and first child's data-review-id
        if (
          beforeLastChild &&
          beforeLastChild.children.length > 0 &&
          beforeLastChild.firstChild?.getAttribute("data-review-id") !== null
        ) {
          return true; // Conditions met
        }
        return false; // Keep checking
      });

      if (result) {
        dataIsValid = true; // Exit the loop when conditions are satisfied
      } else {
        // Wait before re-evaluating to avoid excessive DOM queries
        await wait(1000);
      }
    }
  } catch (error) {
    logger.error("Error waiting for review data:", error);
  }
};

module.exports = waitForReviewData;
