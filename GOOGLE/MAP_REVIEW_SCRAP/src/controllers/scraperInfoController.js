const { uploadFile } = require("../services/storageService");
const { launchBrowser, openPage } = require("../utils/browser");
const wait = require("../utils/wait");

const data = {};

let browser;
let page;

async function main({ url, userId, reviewId, limit, sortBy }) {
  try {
    browser = await launchBrowser();
    page = await openPage(browser, url);
    data.url = url;

    // await page.setCacheEnabled(false);

    data.title = await page.title();

    // await wait(5000);

    // aria-label="Collapse side panel"
    // drawer.close;mouseover:drawer.showToggleTooltip; mouseout:drawer.hideToggleTooltip;focus:drawer.showToggleTooltip;blur:drawer.hideToggleTooltip
    const sidePanel = await page.$$(
      `button[aria-label*="Collapse side panel"][jsaction*="mouseover:drawer.showToggleTooltip"]`
    );
    console.log("sidePanel", sidePanel.length);
    if (sidePanel.length > 0) {
      await page.evaluate((btn) => btn.scrollIntoView(), sidePanel[0]);
      await sidePanel[0].click();
    }

    // await till visible `button[jsaction*="zoom.onZoomOutClick"]`
    await page.waitForSelector(`button[jsaction*="zoom.onZoomOutClick"]`, {
      visible: true,
    });

    // jsaction="mouseover:zoom.onZoomOutPointerIn;zoom.onZoomOutClick;keydown:zoom.keydownAndRipple;ptrdown:ripple.nested;mousedown:ripple.nested"
    const zoomOut = await page.$$(`button[jsaction*="zoom.onZoomOutClick"]`);
    console.log("zoomOut", zoomOut.length);
    if (zoomOut.length > 0) {
      await page.evaluate((btn) => btn.scrollIntoView(), zoomOut[0]);
      // await zoomOut[0].click();
      // click 3 times
      for (let i = 0; i < 3; i++) {
        await zoomOut[0].click();
        await wait(500);
      }
    }

    await wait(1000);

    // take screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    // https://maps.app.goo.gl/ugSM2JEXaFcxbTtq7
    const uniqueId = url.split("/").pop();
    // Upload screenshot to Firebase Storage
    await wait(500);
    const img = await uploadFile(
      screenshot,
      `${userId}/${uniqueId}/screenshot.png`
    );
    data.screenshot = img;
    // Upload screenshot to Google Cloud Storage
    // const storage = new Storage();
    // const bucket = storage.bucket("map-review-scraper");
    // const file = bucket.file(`${userId}/${reviewId}/screenshot.png`);
    // await file.save(screenshot, {
    //   metadata: {
    //     contentType: "image/png",
    //   },
    // });
    // data.screenshot = `https://storage.googleapis.com/map-review-scraper/${userId}/${reviewId}/screenshot.png`;
    // data.screenshot = screenshot.toString("base64");

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
