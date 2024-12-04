const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const {
  getInitialReviews,
  watchReviews,
  sortReviews,
} = require("./helper/reviews");
const tag =
  process.env.TAG || "info_iigecj14ivrk37rmzdsefu1pufat_guiauzsmjqutgip3cqf9";

(async function init() {
  async function getMachineData() {
    console.log("Getting machine data for", tag);
    if (!tag) {
      console.error("Tag not found");
      return;
    }
    try {
      await firestore.doc(`machines/${tag}`).get();
    } catch (error) {
      console.error("Error getting machine data", error);
    }
    const machine = await firestore.doc(`machines/${tag}`).get();
    console.log("Machine data", machine.data());
    if (!machine.exists) {
      console.error("Machine not found");
      return;
    }

    return machine.data();
  }

  let data = await getMachineData();
  const { url, userId, reviewId } = data;
  console.log("Scraping data for", url);

  if (!data) {
    firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update({
      status: "error",
      error: "Machine not found",
    });
    return;
  }

  let options = new chrome.Options();
  options.addArguments(
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-popup-blocking",
    "--window-size=1200,800"
  );
  options.setLoggingPrefs({ browser: "ALL" });
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  driver.manage().setTimeouts({
    implicit: 10000, // Wait for elements
    pageLoad: 10000, // Wait for page to load
    script: 10000, // Wait for async scripts
  });

  let startTimestamp = new Date().getTime();
  await driver.get(url);
  await driver.sleep(2000);
  let currentUrl = await driver.getCurrentUrl();
  console.log("Current URL:", currentUrl);
  await driver.wait(until.urlContains(currentUrl), 10000);
  let spentTimeInSeconds = (new Date().getTime() - startTimestamp) / 1000;
  console.log("Spent time:", spentTimeInSeconds, "seconds");

  // const allButtons = document.querySelectorAll('button[role="tab"]');
  // for (const button of allButtons) {
  //   const tabText = button.textContent?.trim().toLowerCase() || "";
  //   if (tabText.includes("reviews")) {
  //     button.click();
  //     return;
  //   }
  // }

  const reviewsTabs = await driver.findElements(By.css('button[role="tab"]'));
  for (const tab of reviewsTabs) {
    const tabText = await tab.getText();
    if (tabText.toLowerCase().includes("reviews")) {
      tab.click();
      break;
    }
  }

  // reload the page
  // await driver.navigate().refresh();

  // page.exposeFunction("newNodes", function (record) {
  //   newNodes$.next(record);
  // });
  // const loggs = (message) => {
  //   console.log("Loggs:", message);
  // };
  // add global function to the page which calls the loggs function
  // await driver.executeScript(`window.newNodes = function (record) {
  //   window.loggs(record

  await driver.sleep(2000);
  await sortReviews(driver, "Newest");
  console.log("Sorted reviews");

  let reviews = [];
  while (reviews.length === 0) {
    reviews = await getInitialReviews(driver);
    console.log("Initial reviews", reviews);

    // take a screenshot and upload to firebase
    // const parentEl = document.querySelector(".vyucnb").parentElement;
    // const scrollContainer = parentEl.children[parentEl.children.length - 2];
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
    // const node = await driver.findElement(
    //   By.css(`div[data-review-id="${reviews[reviews.length - 1]}"]`)
    // );
    // // scrollIntoView
    // if (node) {
    //   await driver.executeScript("arguments[0].scrollIntoView();", node);
    // }
  }

  console.log("Watching reviews");
  watchReviews(driver);

  // quit the driver
  // wait 5 sec
  // await driver.sleep(10000000);
  // await driver.quit();
})();
