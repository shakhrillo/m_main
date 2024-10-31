const puppeteer = require('puppeteer');
const config = require('../config/settings');
const logger = require('./logger');

async function launchBrowser() {
  logger.info('Launching browser');
  return await puppeteer.launch(config.launch);
}

async function openPage(browser, url) {
  logger.info(`Opening page: ${url}`);
  const page = await browser.newPage();
  // await page.setRequestInterception(true);
  // page.on('request', (request) => {
  //   if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
  //     logger.info(`Blocked resource: ${request.resourceType()}`);
  //     request.abort(); // Block unnecessary resources
  //   } else {
  //     logger.info(`Allowed resource: ${request.resourceType()}`);
  //     request.continue();
  //   }
  // });

  await page.goto(url, config.goto);
  await page.setViewport(config.viewport);
  logger.info('Page opened');
  return page;
}

module.exports = { launchBrowser, openPage };
