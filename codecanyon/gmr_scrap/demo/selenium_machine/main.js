const { Builder, By, until, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { db, uploadFile } = require("./services/firebase");

const {
  getInitialReviews,
  watchReviews,
  sortReviews,
} = require("./helper/reviews");

const tag = process.env.TAG;

if (!tag) {
  console.error("Tag not found");
  return;
}

async function getMachineData() {
  const snapshot = await db.doc(`machines/${tag}`).get();
  const data = snapshot.data();

  return data;
}

(async function init() {
  let data = await getMachineData();
  const { url, userId, reviewId } = data;
  console.log("Scraping data for", url);

  if (!data) {
    db.doc(`users/${userId}/reviewOverview/${reviewId}`).update({
      status: "error",
      error: "Machine not found",
    });
    return;
  }

  const options = new chrome.Options();
  options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
  options.setLoggingPrefs({ browser: "ALL" });
  options.setChromeBinaryPath("/usr/bin/chromium");
  options.excludeSwitches("enable-automation");

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: 3000,
    pageLoad: 180000,
    script: 180000,
  });

  // -----------------
  // Start scraping
  // ----------------
  await driver.get(url);
  await driver.sleep(2000);

  const reviewsTabs = await driver.findElements(By.css('button[role="tab"]'));
  for (const tab of reviewsTabs) {
    const tabText = await tab.getText();
    if (tabText.toLowerCase().includes("reviews")) {
      tab.click();
      break;
    }
  }

  await driver.sleep(2000);
  await sortReviews(driver, data.sortBy);
  console.log("Sorted reviews");

  let reviews = [];
  while (reviews.length === 0) {
    reviews = await getInitialReviews(driver);
    console.log("Initial reviews", reviews);

    await driver.executeScript(`
      const parentEl = document.querySelector(".vyucnb").parentElement;
      const loaderEl = parentEl.children[parentEl.children.length - 1];
      loaderEl.scrollIntoView();
    `);
    const screenshot = await driver.takeScreenshot();
    const screenshotBuffer = Buffer.from(screenshot, "base64");
    await uploadFile(
      screenshotBuffer,
      `test/${tag}/screenshot-${new Date().getTime()}.png`
    );
    await driver.sleep(2000);
    await driver.executeScript(`
      const parentEl = document.querySelector(".vyucnb").parentElement;
      const initEl = parentEl.children[0];
      initEl.scrollIntoView();
    `);
  }
  console.log("Done watching reviews");

  if (reviews.length) {
    await driver.executeScript(`
      const parentEl = document.querySelector(".vyucnb").parentElement;
      const scrollContainer = parentEl.children[parentEl.children.length - 2];
      const lastChild = scrollContainer.children[scrollContainer.children.length - 1];
      lastChild.scrollIntoView();
    `);
  }

  console.log("Watching reviews");
  watchReviews(driver, data);
})();
