const { By } = require("selenium-webdriver");
const { getMachineData } = require("./services/firebase");

const { watchReviews } = require("./helper/reviews");
const { getDriver } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");

const tag = process.env.TAG;

if (!tag) {
  console.error("Tag not found");
  return;
}

async function init() {
  const data = await getMachineData(tag);
  const driver = await getDriver();

  // ----------------- Start the process -----------------
  await driver.get(data.url);
  await driver.sleep(2000);

  // ----------------- Click on the reviews tab -----------------
  const reviewsTabs =
    (await driver.findElements(By.css('button[role="tab"]'))) || [];
  for (const tab of reviewsTabs) {
    const tabText = await tab.getText();
    if (tabText.toLowerCase().includes("reviews")) {
      tab.click();
      break;
    }
  }
  await driver.sleep(2000);

  // ----------------- Sort the reviews -----------------
  const sortButton = await driver.findElement(
    By.css(
      'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
    )
  );
  if (sortButton) {
    await sortButton.click();
    await driver.sleep(400);

    const menuItems = await driver.findElements(
      By.css('[role="menuitemradio"]')
    );
    for (const item of menuItems) {
      const text = await item.getText();

      if (text === data.sortBy) {
        await item.click();
        console.log("Sorting by:", data.sortBy);
        break;
      }
    }
  }
  await driver.sleep(2000);

  // ----------------- Wait for the reviews to load -----------------
  let reviewIds = [];
  let retryCount = 0;
  const getReviewIds = getScriptContent("getReviewIds.js", "scripts");
  const scrollToLoader = getScriptContent("scrollToLoader.js", "scripts");
  const scrollToContainer = getScriptContent("scrollToContainer.js", "scripts");

  while (reviewIds.length === 0 && retryCount < 10) {
    reviewIds = await driver.executeScript(getReviewIds);
    await driver.executeScript(scrollToLoader);
    await driver.sleep(1000);
    await driver.executeScript(scrollToContainer);
    retryCount++;
  }

  if (reviewIds.length === 0) {
    console.log("No reviews found");
    driver.quit();
    return;
  }

  console.log("Initial reviewIds:", reviewIds);

  // ----------------- Watch the reviews -----------------
  watchReviews(driver, data);

  // ----------------- Scroll to the loader -----------------
  await driver.executeScript(scrollToLoader);
}
try {
  init();
} catch (error) {
  console.error("Error in main.js", error);
}
