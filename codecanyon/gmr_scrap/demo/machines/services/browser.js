const puppeteer = require("puppeteer");

const launchBrowser = async () =>
  puppeteer.launch({
    headless: true,
    defaultViewport: null,
    protocolTimeout: 60000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

const openPage = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1200, height: 800 });
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
