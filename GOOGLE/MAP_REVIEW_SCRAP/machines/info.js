require("dotenv").config();
const { launchBrowser, openPage } = require("./services/browser");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");

async function init() {
  const url = process.env.URL;
  const userId = process.env.USER_ID;
  const reviewId = process.env.REVIEW_ID;
  // const limit = process.env.LIMIT;
  // const sortBy = process.env.SORT_BY;

  console.log("Setting up...");
  await firestore
    .collection(`users/${userId}/reviewOverview`)
    .doc(reviewId)
    .update({
      url,
      userId,
      reviewId,
      // limit,
      // sortBy,
      createdAt: new Date(),
      pending: true,
    });
  console.log("Initializing...");
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = await page.evaluate(async () => {
    const stringToNumber = (str) =>
      parseInt(str.replace(/[^0-9,]/g, "").replace(/,/g, ""), 10);

    const data = {};
    const h1 = document.querySelector("h1");
    const title = h1.innerText;
    data.title = title;

    const address = document.querySelector("button[data-item-id='address']");
    if (address) {
      const addressText = address.getAttribute("aria-label");
      data.address = addressText.replace("Address: ", "");
    }

    const btnReviewChart = document.querySelector(
      `button[jsaction*="reviewChart.moreReviews"]`
    );
    if (btnReviewChart) {
      const btnReviewChartText = btnReviewChart.innerText;
      data.reviews = stringToNumber(btnReviewChartText);
    }

    const rating = document.querySelector(`[role="img"][aria-label*="stars"]`);
    if (rating) {
      const ratingText = rating.getAttribute("aria-label");
      data.rating = parseFloat(ratingText);
    }

    return data;
  });

  await page.evaluate(async () => {
    const sidePanel = document.querySelector(
      'button[aria-label*="Collapse side panel"][jsaction*="mouseover:drawer.showToggleTooltip"]'
    );
    if (sidePanel) {
      sidePanel.click();
    }
    const zoomOutButton = document.querySelector(
      'button[jsaction*="zoom.onZoomOutClick"]'
    );
    if (zoomOutButton) {
      zoomOutButton.click();
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.evaluate(async () => {
    [
      `button[aria-labelledby="widget-minimap-icon-overlay"]`,
      `button[jsaction*="minimap.main"]`,
      `.app-vertical-widget-holder`,
      `a[aria-label="Sign in"]`,
      `.app-horizontal-widget-holder`,
      `a[title="Google apps"]`,
      `button[aria-label*="Expand side panel"]`,
      `.scene-footer`,
    ].forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach((el) => {
          el.style.display = "none";
        });
      }
    });
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const screenshot = await page.screenshot({ fullPage: true });
  const uniqueId = url.split("/").pop();
  data.screenshot = await uploadFile(
    screenshot,
    `${userId}/${uniqueId}/screenshot.png`
  );

  console.log("Data:", data);
  await page.close();
  await browser.close();
  await firestore
    .collection(`users/${userId}/reviewOverview`)
    .doc(reviewId)
    .update({
      ...data,
      pending: false,
      completedAt: new Date(),
    });
  console.log("Done");
}

init();
