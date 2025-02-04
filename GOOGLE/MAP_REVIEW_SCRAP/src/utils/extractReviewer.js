/**
 * Extracts the reviewer's information from a review element on the given page.
 *
 * @param {Page} page - The Puppeteer page object representing the current web page.
 * @param {string} reviewId - The ID of the review from which to extract the reviewer information.
 * @returns {Promise<{name: string, info: string[], href: string, content: string[]}>}
 * - A promise that resolves to an object containing the reviewer's name, info, href, and content or null if no reviewer is found.
 */
async function extractReviewer(page, reviewId) {
  const results = {
    name: "",
    info: [],
    href: "",
    content: [],
  };
  try {
    // Locate the reviewer button using the review ID
    await page.waitForSelector(
      `button[jsaction*="review.reviewerLink"][data-review-id="${reviewId}"]`
    );

    let reviewerButton =
      (await page.$$(
        `button[jsaction*="review.reviewerLink"][data-review-id="${reviewId}"]`
      )) || [];
    if (!reviewerButton.length) {
      console.warn(`No reviewer button found for review ID: ${reviewId}`);
      return results;
    }

    // Extract information from the reviewer button(s)
    for (const button of reviewerButton) {
      const { href, content } = await button.evaluate((el) => {
        if (!el) return { href: "", content: [] };

        const href = el.getAttribute("data-href");
        let content = (el.innerText || "").split("\n");

        return { href, content };
      });

      results.name = content[0] || ""; // Set the reviewer's name
      results.info = (content[1] || "").split("·").map((item) => {
        if (item) return item.trim();
        return "";
      }); // Parse info into an array
      results.href = href; // Set the href
      results.content = content; // Set the content array
    }

    return results;
  } catch (error) {
    console.error("Error extracting reviewer information:", error);
  }

  return results;
}

module.exports = extractReviewer;
