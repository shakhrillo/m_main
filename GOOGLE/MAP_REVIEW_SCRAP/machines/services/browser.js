const puppeteer = require("puppeteer");

async function launchBrowser() {
  return await puppeteer.launch({
    headless: !true,
    protocolTimeout: 60000,
    args: ["--disable-dev-shm-usage", "--disable-gpu"],
  });
}

async function openPage(browser, url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  await page.setViewport({ width: 1200, height: 800 });
  return page;
}

module.exports = { launchBrowser, openPage };
