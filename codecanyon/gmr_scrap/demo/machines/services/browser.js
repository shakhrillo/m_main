const puppeteer = require("puppeteer");

const launchBrowser = async () =>
  puppeteer.launch({
    headless: true,
    protocolTimeout: 90000,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // Helps with limited shared memory
      "--disable-gpu",
      "--disable-accelerated-2d-canvas",
      "--disable-software-rasterizer",
    ],
    dumpio: true,
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
