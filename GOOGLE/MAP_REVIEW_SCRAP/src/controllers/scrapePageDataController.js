const { launchBrowser, openPage } = require("../services/browserService");
const { uploadFile } = require("../services/storageService");
const wait = require("../utils/wait");
const logger = require("../config/logger");
const clickReviewTab = require("../utils/clickReviewTab");
const sortReviews = require("../utils/sortReviews");
const {
  scrollAndCollectElements,
} = require("../utils/scrollAndCollectElements");
const getReviewsContainer = require("../utils/getReviewsContainer");
const fetchReviewDetails = require("../utils/fetchReviewDetails");
const waitForArrayGrowth = require("../utils/waitForArrayGrowth");

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

async function scrapePageData({ url, userId }, port, containerName) {
  const data = { url };
  let browser;
  let page;

  try {
    browser = await launchBrowser(port);
    page = await openPage(browser, url);
    await page.setCacheEnabled(false);
    data.title = await page.title();
    logger.info(`Scraping page: ${data.title}`);

    const sidePanel = await page.$$(
      `button[aria-label*="Collapse side panel"][jsaction*="mouseover:drawer.showToggleTooltip"]`
    );
    for (const btn of sidePanel) {
      await btn.scrollIntoView();
      await btn.click();
      logger.info("Side panel collapsed");
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
        logger.info("Zoomed out");
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

    await browser.close();
  } catch (error) {
    logger.error("Error in main:", error);
    if (browser && browser.isConnected()) {
      await browser.close();
    }
  }

  return data;
}

async function scrapePageComments(
  { url, userId, reviewId, limit, sortBy },
  port,
  containerName
) {
  const allElements = [];
  let limitIsReached = false;
  const browser = await launchBrowser(port);
  const page = await openPage(browser, url);
  await page.setCacheEnabled(false);
  page.exposeFunction(
    "puppeteerMutationListener",
    async function puppeteerMutationListener(records, uid, pushId) {
      console.log("Record:", records.length);
      console.log("Saved:", allElements.length);

      if (limitIsReached) {
        return;
      }

      for (const record of records) {
        await fetchReviewDetails(page, record)
          .then(async (result) => {
            allElements.push(result);
          })
          .catch((error) => {
            console.error("Error fetching review details:", error);
          });
      }
    }
  );
  await page.evaluate(
    ({ uid, pushId }) => {
      window.uid = uid;
      window.pushId = pushId;
    },
    { uid: userId, pushId: reviewId }
  );

  const title = await page.title();
  await clickReviewTab(page);
  await sortReviews(page, sortBy);
  const elements = await scrollAndCollectElements(
    page,
    userId,
    reviewId,
    limit
  );
  allElements.push(...elements);

  page.evaluate(() => {
    let lastLogTime = Date.now();

    const observerCallback = (records) => {
      for (const record of records) {
        if (record.type === "childList") {
          const addedNodeIds = Array.from(record.addedNodes)
            .map((node) => node.getAttribute("data-review-id"))
            .filter(Boolean);
          puppeteerMutationListener(addedNodeIds);
        }
      }
      lastLogTime = Date.now();
    };

    const logInterval = setInterval(() => {
      if (Date.now() - lastLogTime > 5000) {
        document
          .querySelector(".vyucnb")
          .parentElement.lastChild.scrollIntoView();
      }
    }, 5000);

    const parentEl = document.querySelector(".vyucnb").parentElement;
    new MutationObserver(observerCallback).observe(
      parentEl.children[parentEl.children.length - 2],
      {
        childList: true,
      }
    );
  });

  await waitForArrayGrowth(allElements, limit);

  limitIsReached = true;
  await wait(1000);

  await page.close();
  await browser.close();

  return {
    ...{ url, userId, reviewId, limit, sortBy },
    port,
    containerName,
    title,
    allElements,
  };
}

module.exports = { scrapePageData, scrapePageComments };
