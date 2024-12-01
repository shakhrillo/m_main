require("dotenv").config();
const { launchBrowser, openPage } = require("./services/browser");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");

async function scrap() {
  const tag = process.env.TAG;
  const machine = await firestore.doc(`machines/${tag}`).get();

  if (!machine.exists) {
    console.error("Machine not found");
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return;
  }

  console.log("Scraping machine", machine.data());

  const { url, userId, reviewId } = machine.data();

  // const { url, userId, reviewId } = {
  //   status: "pending",
  //   url: "https://maps.app.goo.gl/azYJTCw997bWC4NTA",
  //   userId: "Gj7HkV86vD1SpOfmSqWjD6TR3sF5",
  //   reviewId: "f0DGir6qLHyXx72Ua8Xg",
  //   limit: 30,
  //   sortBy: "Most relevant",
  //   from: "info_gj7hkv86vd1spofmsqwjd6tr3sf5_f0dgir6qlhyxx72ua8xg",
  //   time: 1733030178,
  // };

  const scrapePageData = async (page) => {
    return page.evaluate(() => {
      const stringToNumber = (str) => {
        if (!str || typeof str !== "string") {
          return 0;
        }
        const cleanedString = str.replace(/[^0-9,]/g, "").replace(/,/g, "");
        const number = parseInt(cleanedString, 10);
        return isNaN(number) ? 0 : number;
      };

      const getData = (selector, attr = "innerText") => {
        const element = document.querySelector(selector);
        if (!element || !element[attr]) {
          return "";
        }
        const rawData = element[attr];
        if (typeof rawData !== "string") {
          return "";
        }
        return rawData.replace(/Address: /, "");
      };

      const getTitle = () => {
        const title = getData("h1");
        return title ? title : "";
      };

      const getAddress = () => {
        const address = getData("button[data-item-id='address']", "ariaLabel");
        return address ? address : "";
      };

      const getReviews = () => {
        const reviewsText = getData(
          `button[jsaction*="reviewChart.moreReviews"]`
        );
        const reviewsNumber = stringToNumber(reviewsText);
        return reviewsNumber ? reviewsNumber : 0;
      };

      const getRating = () => {
        const ratingText = getData(
          `[role="img"][aria-label*="stars"]`,
          "ariaLabel"
        );
        const rating = parseFloat(ratingText);
        return isNaN(rating) ? 0 : rating;
      };

      return {
        title: getTitle(),
        address: getAddress(),
        reviews: getReviews(),
        rating: getRating(),
      };
    });
  };

  try {
    const browser = await launchBrowser();
    console.log("Browser launched");
    const page = await openPage(browser, url);
    console.log("Page opened");
    await page.waitForSelector("h1");
    console.log("Page loaded");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await scrapePageData(page);
    console.log("Data scraped", data);
    // wait for drawer close
    await page.waitForSelector(`button[jsaction*="drawer.close"]`);

    let closeDrawerButton = await page.$(`button[jsaction*="drawer.close"]`);
    while (closeDrawerButton) {
      if (closeDrawerButton) {
        await closeDrawerButton.click();
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      closeDrawerButton = await page.$(`button[jsaction*="drawer.close"]`);
      console.log("Retrying to close drawer");
    }

    await page.waitForSelector(`button[jsaction*="drawer.open"]`, {
      timeout: 5000,
      visible: true,
    });
    console.log("Drawer open button found");
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Waiting for drawer to open 2 seconds");

    const selectors = [
      `button[aria-labelledby="widget-minimap-icon-overlay"]`,
      `button[jsaction*="minimap.main"]`,
      `.app-vertical-widget-holder`,
      `a[aria-label="Sign in"]`,
      `.app-horizontal-widget-holder`,
      `a[title="Google apps"]`,
      `button[aria-label*="Expand side panel"]`,
      `.scene-footer`,
      '[role="button"]',
    ];

    for (const selector of selectors) {
      const exists = await page.$(selector);
      if (exists) {
        await page.evaluate((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            if (selector.includes("widget-minimap-icon-overlay")) {
              const parent = element.parentElement;
              if (parent) {
                parent.style.display = "none";
              }
            } else {
              element.style.display = "none";
            }
          });
        }, selector);
      }
    }

    console.log("Page cleaned");

    const screenshot = await page.screenshot({ fullPage: true });
    console.log("Screenshot taken");
    const uniqueId = new Date().getTime();
    data.screenshot = await uploadFile(
      screenshot,
      `${userId}/${uniqueId}/screenshot.png`
    );

    await page.close();
    await browser.close();
    console.log("Data scraped", data);
    firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update(data);
  } catch (error) {
    console.error("Error scraping data", error);
  }
}

try {
  scrap();
} catch (error) {
  console.error(error);
}
