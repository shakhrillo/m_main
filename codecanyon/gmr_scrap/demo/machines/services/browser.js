const puppeteer = require("puppeteer");

async function launchBrowser() {
  try {
    return await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      // executablePath: "/usr/bin/google-chrome-stable",
      protocolTimeout: 60000,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (error) {
    console.error("Error launching browser:", error);
  }
}

async function openPage(browser, url) {
  const page = await browser.newPage();
  console.log("Opening page", url);
  await page.goto(url, {
    waitUntil: "load",
    timeout: 60000,
  });
  console.log("Page opened");
  await page.setViewport({ width: 1200, height: 800 });
  return page;
}

module.exports = { launchBrowser, openPage };
