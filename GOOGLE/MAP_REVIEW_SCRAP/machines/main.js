require("dotenv").config();
const { launchBrowser, openPage } = require("./services/browser");
const { firestore } = require("./services/firebase");

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function hideElements(page, selectors) {
  for (const selector of selectors) {
    const elements = await page.$$(selector);
    if (elements.length > 0) {
      await page.evaluate(
        (el) => (el.parentElement.style.display = "none"),
        elements[0]
      );
    }
    await wait(500);
  }
}

async function extractAriaLabel(page, selector) {
  const elements = await page.$$(selector);
  if (elements.length > 0) {
    return elements[0].evaluate((el) => el.getAttribute("aria-label"));
  }
  return null;
}

const { uploadFile } = require("./services/storage");

async function init() {
  const url = process.env.URL;
  const userId = process.env.USER_ID;
  const reviewId = process.env.REVIEW_ID;
  const limit = process.env.LIMIT;
  const sortBy = process.env.SORT_BY;

  console.log("Setting up...");
  await firestore
    .collection(`users/${userId}/reviewOverview`)
    .doc(reviewId)
    .set(
      {
        url,
        userId,
        reviewId,
        limit,
        sortBy,
        createdAt: new Date(),
        pending: true,
      },
      { merge: true }
    );
  console.log("Initializing...");
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  const data = {};
  data.title = await page.title();
  const sidePanel = await page.$$(
    `button[aria-label*="Collapse side panel"][jsaction*="mouseover:drawer.showToggleTooltip"]`
  );
  for (const btn of sidePanel) {
    await btn.scrollIntoView();
    await btn.click();
    console.info("Side panel collapsed");
  }
  await page.waitForSelector(`button[jsaction*="zoom.onZoomOutClick"]`, {
    visible: true,
  });

  const zoomOutButton = await page.$$(
    `button[jsaction*="zoom.onZoomOutClick"]`
  );
  for (const btn of zoomOutButton) {
    for (let i = 0; i < 2; i++) {
      await btn.click();
      await wait(500);
      console.info("Zoomed out");
    }
  }

  await hideElements(page, [
    `button[jsaction*="minimap.main"]`,
    `.app-vertical-widget-holder`,
    `a[aria-label="Sign in"]`,
    `.app-horizontal-widget-holder`,
    `a[title="Google apps"]`,
    `button[aria-label*="Expand side panel"]`,
    `.scene-footer`,
  ]);

  const screenshot = await page.screenshot({ fullPage: true });
  const uniqueId = url.split("/").pop();
  data.screenshot = await uploadFile(
    screenshot,
    `${userId}/${uniqueId}/screenshot.png`
  );

  data.address = await extractAriaLabel(
    page,
    `button[data-item-id*="address"]`
  );
  data.phone = await extractAriaLabel(page, `[data-item-id*="phone"]`);
  data.website = await extractAriaLabel(page, `[data-item-id*="authority"]`);
  data.rating = await extractAriaLabel(
    page,
    `[role="img"][aria-label*="stars"]`
  );
  data.reviews = await extractAriaLabel(
    page,
    `button[jsaction*="moreReviews"]`
  );
  console.log("Data:", data);
  await page.close();
  await browser.close();
  await firestore
    .collection(`users/${userId}/reviewOverview`)
    .doc(reviewId)
    .set(
      {
        ...data,
        pending: false,
        completedAt: new Date(),
      },
      { merge: true }
    );
  console.log("Done");
}

init();
