const { launchBrowser, openPage } = require("../services/browserService");
const { uploadFile } = require("../services/storageService");
const wait = require("../utils/wait");
const logger = require("../config/logger");

async function hideElements(page, selectors) {
  for (const selector of selectors) {
    const elements = await page.$$(selector);
    if (elements.length > 0) {
      await page.evaluate(
        (el) => (el.parentElement.style.display = "none"),
        elements[0]
      );
    }
  }
}

async function extractAriaLabel(page, selector) {
  const elements = await page.$$(selector);
  if (elements.length > 0) {
    return elements[0].evaluate((el) => el.getAttribute("aria-label"));
  }
  return null;
}

async function scrapePageData({ url, userId }, port) {
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
    ]);

    await wait(1000);

    // Capture and upload screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    const uniqueId = url.split("/").pop();
    data.screenshot = await uploadFile(
      screenshot,
      `${userId}/${uniqueId}/screenshot.png`
    );

    // Extract additional information
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

    await page.close();
    await browser.close();
  } catch (error) {
    logger.error("Error in main:", error);
    if (browser && browser.isConnected()) {
      await browser.close();
    }
  }

  return data;
}

module.exports = { scrapePageData };
