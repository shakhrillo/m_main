const puppeteer = require("puppeteer");

const launchBrowser = async () =>
  puppeteer.launch({
    headless: true,
    protocolTimeout: 60000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

const openPage = async (
  browser,
  url,
  viewport = { width: 1200, height: 800 }
) => {
  if (!browser) throw new Error("Browser instance is required.");
  const pages = await browser.pages();
  const page = pages.length > 0 ? pages[0] : await browser.newPage();

  try {
    await page.goto(url);
    await page.setViewport(viewport);
    return page;
  } catch (error) {
    console.error(`Failed to open page: ${error.message}`);
    throw error;
  }
};

const closeBrowser = async (browser) => {
  console.log("Closing browser...");
  if (browser) {
    await browser.close();
    console.log("Browser closed");
  }
};

module.exports = { launchBrowser, openPage, closeBrowser };
