require("dotenv").config();
const { launchBrowser, openPage } = require("./services/browser");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const tag =
  process.env.TAG || "info_u7lhhvogwity1rbqwvqoc6nueqm2_fngyfqjlfay5q5eyucer";

async function getMachineData() {
  console.log("Getting machine data for", tag);
  if (!tag) {
    console.error("Tag not found");
    return;
  }
  const machine = await firestore.doc(`machines/${tag}`).get();
  console.log("Machine data", machine.data());
  if (!machine.exists) {
    console.error("Machine not found");
    return;
  }

  return machine.data();
}

async function scrap() {
  let data = await getMachineData();
  if (!data) {
    firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update({
      status: "error",
      error: "Machine not found",
    });
    return;
  }

  const { url, userId, reviewId } = data;
  console.log("Scraping data for", url);

  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  console.log("Page loaded");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("after 3 seconds");

  try {
    const title = await page.title();
    data.title = title;
    console.log("Title", title);
  } catch (error) {
    console.info("Error getting title", error);
  }

  try {
    await page.waitForSelector("button[aria-label='Collapse side panel']", {
      timeout: 30000,
    });
    const sidePanelBtns = await page.$$(
      "button[aria-label='Collapse side panel']"
    );
    console.log("sidePanelBtns", sidePanelBtns.length);
    for (const btn of sidePanelBtns) {
      if (!(await btn.isIntersectingViewport())) {
        continue;
      }
      await btn.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.info("Error collapsing side panel", error);
    firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update({
      status: "error",
      error: "Not found required element",
    });
    browser.close();
    return;
  }

  try {
    const address = await page.$eval("button[data-item-id='address']", (el) =>
      el.getAttribute("aria-label")
    );
    data.address = address;
  } catch (error) {
    console.info("Error getting address", error);
  }

  try {
    const reviews = await page.$eval(
      "button[jsaction*='reviewChart.moreReviews']",
      (el) =>
        parseInt(el.innerText.replace(/[^0-9,]/g, "").replace(/,/g, ""), 10)
    );
    data.reviews = reviews;
  } catch (error) {
    console.info("Error getting reviews", error);
  }

  try {
    const rating = await page.$eval("[role='img'][aria-label*='stars']", (el) =>
      parseFloat(el.getAttribute("aria-label"))
    );

    data.rating = rating;
  } catch (error) {
    console.info("Error getting rating", error);
  }

  try {
    await page.waitForSelector("#minimap");
    const minimap = await page.$("#minimap");
    await minimap.evaluate((el) => el.remove());
  } catch (error) {
    console.info("Error removing minimap", error);
  }

  try {
    await page.waitForSelector(".app-viewcard-strip");
    const viewcardStrip = await page.$(".app-viewcard-strip");
    await viewcardStrip.evaluate((el) => el.remove());
  } catch (error) {
    console.info("Error removing viewcard strip", error);
  }

  try {
    const screenshot = await page.screenshot({ fullPage: true });
    const uniqueId = new Date().getTime();
    data.screenshot = await uploadFile(
      screenshot,
      `${userId}/${uniqueId}/screenshot.png`
    );
  } catch (error) {
    console.info("Error taking screenshot", error);
  }

  await page.close();
  await browser.close();
  console.log("Data scraped", data);
  firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update(data);
}

try {
  scrap();
} catch (error) {
  console.error(error);
}
