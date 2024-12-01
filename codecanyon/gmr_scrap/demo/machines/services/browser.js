const puppeteer = require("puppeteer");

const launchBrowser = async () =>
  puppeteer.launch({
    headless: true,
    protocolTimeout: 90000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

const openPage = async (browser, url) => {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
  } catch (error) {
    console.warn(`Error during page navigation: ${error.message}`);
  }
  await page.setViewport({ width: 1200, height: 800 });

  try {
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 0 });
  } catch (error) {
    console.warn(`Error during wait for navigation: ${error.message}`);
  }

  return page;
};

const closeBrowser = async (browser) => {
  console.log("Closing browser...");
  if (browser) {
    await browser.close();
    console.log("Browser closed");
  }
};

module.exports = { launchBrowser, openPage, closeBrowser };
