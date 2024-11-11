const puppeteer = require("puppeteer");
const config = require("../config/settings");
const wait = require("./wait");

async function launchBrowser() {
  try {
    const browser = await puppeteer.launch(config.launch);
    console.log("Browser launched successfully");
    return browser;
  } catch (error) {
    console.error("Failed to launch browser:", error);
    throw error;
  }
}

async function openPage(browser, url) {
  try {
    let pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    console.log(`Opening page: ${url}`);

    const navigationTimeout = config?.goto?.timeout || 30000;
    await page.goto(url, { ...config.goto, timeout: 0 });

    // const viewportConfig = config.viewport || { width: 1200, height: 800 };
    // await page.setViewport(viewportConfig);

    await wait(2000);
    console.log("Page opened successfully");

    return page;
  } catch (error) {
    console.error(`Failed to open page: ${url}. Error: ${error.message}`);

    return null;
  }
}

module.exports = { launchBrowser, openPage };
