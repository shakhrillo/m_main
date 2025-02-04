const logger = require("../config/logger");
/**
 * Extracts the text of a review from a review element.
 *
 * @param {ElementHandle} element - The review element from which to extract the text.
 * @returns {Promise<string>} - A promise that resolves to the review text or an empty string if no review text is found.
 */
async function extractReviewText(element) {
  try {
    // Locate the review container and ensure it's found
    const reviewContainer = await element.$$(".MyEned");
    if (!reviewContainer.length) {
      logger.warn("No review containers found.");
      return "";
    }

    // Extract the review text from the parent element of the first review container
    let reviewTextContent = "";
    for (const review of reviewContainer) {
      reviewTextContent +=
        (await review.evaluate((el) => {
          const lastSpan = el.querySelector("span:last-of-type");
          const lastSpanText = lastSpan?.textContent?.trim() || "";

          // Check for "Read more" and fallback to the first span if needed
          if (lastSpanText.includes("Read more")) {
            const firstSpan = el.querySelector("span:first-of-type");
            return firstSpan?.textContent?.trim() || "";
          }

          return lastSpanText;
        })) + "\n";
    }
    return reviewTextContent;
  } catch (error) {
    logger.error("Error extracting review text:", error);
    return "";
  }
}

module.exports = extractReviewText;
