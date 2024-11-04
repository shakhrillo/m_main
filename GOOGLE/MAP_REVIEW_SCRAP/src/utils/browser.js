const puppeteer = require('puppeteer');
const config = require('../config/settings');
const logger = require('./logger');
const wait = require('./wait');

async function launchBrowser() {
  try {
    logger.info('Launching browser...');
    const browser = await puppeteer.launch(config.launch);
    logger.info('Browser launched successfully');
    return browser;
  } catch (error) {
    logger.error('Failed to launch browser:', error);
    throw error;
  }
}

async function openPage(browser, url) {
  try {
    let pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    logger.info(`Opening page: ${url}`);

    const navigationTimeout = config?.goto?.timeout || 30000;

    await page.goto(url, { ...config.goto, timeout: navigationTimeout });

    const viewportConfig = config.viewport || { width: 600, height: 800 };
    await page.setViewport(viewportConfig);

    await wait(2000);

    logger.info('Page opened successfully');
    return page;

  } catch (error) {
    logger.error(`Failed to open page: ${url}. Error: ${error.message}`);

    return null;
  }
}

module.exports = { launchBrowser, openPage };
