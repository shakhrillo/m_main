const puppeteer = require("puppeteer");
const config = require("../config/settings");
const logger = require("../config/logger");
const wait = require("../utils/wait");

/**
 * Launches a browser instance and connects to it via WebSocket.
 * @param {number} port - The WebSocket port to connect to.
 * @returns {Promise<Browser>} The connected Puppeteer browser instance.
 */
async function launchBrowser(port) {
  try {
    let browser;
    if (!config.launch.headless) {
      browser = await puppeteer.launch(config.launch);
      logger.info("Browser launched successfully");
      return browser;
    } else {
      browser = await puppeteer.connect({
        browserWSEndpoint: `ws://localhost:${port}`,
      });
    }

    // const browser = await puppeteer.connect({
    //   ...config.launch,
    //   ...(config.launch.headless
    //     ? { browserWSEndpoint: `ws://localhost:${port}` }
    //     : {}),
    // });
    logger.info("Browser launched successfully");
    return browser;
  } catch (error) {
    logger.error(`Failed to launch browser: ${error.message}`);
    throw error;
  }
}

/**
 * Opens a new page or reuses an existing one in the given browser, and navigates to the specified URL.
 * @param {Browser} browser - The Puppeteer browser instance.
 * @param {string} url - The URL to navigate to.
 * @returns {Promise<Page|null>} The Puppeteer page instance or null if navigation fails.
 */
async function openPage(browser, url) {
  try {
    const pages = await browser.pages();
    // const page = pages.length > 0 ? pages[0] : await browser.newPage();
    const page = await browser.newPage();

    logger.info("Page instance ready");

    const navigationTimeout = config?.goto?.timeout || 30000;
    await page.goto(url, { ...config.goto, timeout: navigationTimeout });

    const viewport = config.viewport || { width: 1200, height: 800 };
    await page.setViewport(viewport);

    await wait(2000);
    logger.info(`Navigated to URL: ${url}`);

    return page;
  } catch (error) {
    logger.error(`Failed to open page at URL (${url}): ${error.message}`);
    return null;
  }
}

module.exports = { launchBrowser, openPage };
