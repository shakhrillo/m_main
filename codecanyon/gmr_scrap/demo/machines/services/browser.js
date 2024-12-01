const puppeteer = require("puppeteer");

const launchBrowser = async () =>
  puppeteer.launch({
    headless: true,
    protocolTimeout: 90000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
    ],
  });

const openPage = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForFunction(`window.location.href !== "${url}"`, {
    timeout: 30000,
  });
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
