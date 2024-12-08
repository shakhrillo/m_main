const { Builder, By, until } = require("selenium-webdriver");
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

  let options = new chrome.Options();
  options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--aggressive-cache-discard");
  options.addArguments("--disable-cache");
  options.addArguments("--disable-application-cache");
  options.addArguments("--disable-offline-load-stale-cache");
  options.addArguments("--disk-cache-size=0");
  options.addArguments("--disable-gpu");
  options.addArguments("--dns-prefetch-disable");
  options.addArguments("--no-proxy-server");
  options.addArguments("--log-level=3");
  options.addArguments("--silent");
  options.addArguments("--disable-browser-side-navigation");
  options.setProxy(null);
  options.setLoggingPrefs({ browser: "ALL" });

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: 60000, // Wait for elements
    pageLoad: 60000, // Wait for page to load
    script: 60000, // Wait for async scripts
  });

  let startTimestamp = new Date().getTime();
  await driver.get(url);
  await driver.sleep(2000);
  let currentUrl = await driver.getCurrentUrl();
  console.log("Current URL:", currentUrl);
  await driver.wait(until.urlContains(currentUrl), 10000);
  let spentTimeInSeconds = (new Date().getTime() - startTimestamp) / 1000;
  console.log("Spent time:", spentTimeInSeconds, "seconds");

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
