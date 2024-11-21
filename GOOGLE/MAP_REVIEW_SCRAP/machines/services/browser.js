const puppeteer = require("puppeteer");

async function launchBrowser() {
  try {
    return await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      // executablePath: "/usr/bin/google-chrome",
      protocolTimeout: 60000,
      args: ["--no-sandbox"],
    });
  } catch (error) {
    console.error("Error launching browser:", error);
  }
}

async function openPage(browser, url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await page.setViewport({ width: 1200, height: 800 });
  return page;
}

module.exports = { launchBrowser, openPage };
