const { launchBrowser, openPage } = require("../utils/browser");

const data = {};

let page;

async function main({ url, userId, reviewId, limit, sortBy }) {
  try {
    const browser = await launchBrowser();
    page = await openPage(browser, url);
    data.url = url;

    // await page.setCacheEnabled(false);

    data.title = await page.title();

    const address = await page.$$(`button[data-item-id*="address"]`);
    if (address.length > 0) {
      const ariaLabel = await address[0].evaluate((el) =>
        el.getAttribute("aria-label")
      );
      data.address = ariaLabel;
    }

    const phone = await page.$$(`[data-item-id*="phone"]`);
    if (phone.length > 0) {
      const ariaLabel = await phone[0].evaluate((el) =>
        el.getAttribute("aria-label")
      );
      data.phone = ariaLabel;
    }

    const website = await page.$$(`[data-item-id*="authority"]`);
    if (website.length > 0) {
      const ariaLabel = await website[0].evaluate((el) =>
        el.getAttribute("aria-label")
      );
      data.website = ariaLabel;
    }

    const rating = await page.$$(`[role="img"][aria-label*="stars"]`);
    if (rating.length > 0) {
      const ariaLabel = await rating[0].evaluate((el) =>
        el.getAttribute("aria-label")
      );
      data.rating = ariaLabel;
    }

    const reviews = await page.$$(`button[jsaction*="moreReviews"]`);
    if (reviews.length > 0) {
      const innerText = await reviews[0].evaluate((el) => el.innerText);
      data.reviews = innerText;
    }

    await page.close();
    await browser.close();
  } catch (error) {
    await page.close();
    await browser.close();
    console.error("Error in main:", error);
  }

  return data;
}

// Export the main function for Google Cloud Functions
module.exports = main;
