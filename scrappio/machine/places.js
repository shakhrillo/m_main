"use strict";

require("dotenv").config();
const fs = require('fs');
const { WebDriver, By } = require("selenium-webdriver");
const { Timestamp, FieldValue, GeoPoint } = require("firebase-admin/firestore");
const { uploadFile, getMachineData, updateMachineData, updateUserData, settingsService, batchWriteLargeArray } = require("./services/firebase");
const { getDriver, getSeleniumDetails } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");

// Constants
// const tag = process.env.TAG;

// Validate tag
// if (!tag) {
//   throw new Error("Tag not specified");
// }

// Get the script content for extracting information from the page
const getInfo = getScriptContent("getInfo.js", "scripts");

// Get the script content for preparing the page for screenshot
const prepareForScreenshot = getScriptContent(
  "prepareForScreenshot.js",
  "scripts"
);

let data = {};
let driver;

const fetchedData = [];

(async () => {
  try {
    // Initialize Selenium WebDriver
    driver = await getDriver({
      timeouts: {
        implicit: Number(process.env.IMPLICIT_TIMEOUT || 60000), // For locating elements (milliseconds)
        pageLoad: Number(process.env.PAGE_LOAD_TIMEOUT || 60000), // For page load (milliseconds)
        script: Number(process.env.SCRIPT_TIMEOUT || 60000), // For executing scripts (milliseconds)
      },
      chromePath: process.env.CHROME_PATH,
    });

    // Load the target website
    await driver.get(`https://www.google.com/maps/search/uzbek+restaurant+near+Kaş,+Türkiye`);

    await driver.sleep(3000);

    // div[role="feed"]
    let clickedHrefs = new Set();
    const feedsSelector = "div[role='feed']";

    async function scrapeFeeds() {
      let noMoreFeeds = false;

      while (!noMoreFeeds) {
        console.log("Fetching feeds...");
        
        // Find all feed elements and add timeout 3sec
        const feeds = await driver.findElements(By.css(feedsSelector));

        console.log(`Found feeds`);

        if(feeds.length === 0) {
          console.log("No feeds found");
          noMoreFeeds = true;
          
          // Execute custom function to extract info
          const info = await driver.executeScript(getInfo);
          console.log(`Extracted info: ${JSON.stringify(info)}`);
          fetchedData.push(info);
          return;
        }
        
        // Extract all anchor elements within feeds
        let feedsAEls = await Promise.all(
          feeds.map(feed => feed.findElements(By.tagName("a")))
        );
        feedsAEls = feedsAEls.flat(); // Flatten the array of arrays

        for (const aEl of feedsAEls) {
          try {
            const href = await aEl.getAttribute("href");
            const text = await aEl.getText();

            // pattern="^https:\/\/maps\.app\.goo\.gl\/.+$"
            if (!href || clickedHrefs.has(href) || !href.includes("https://www.google.com/maps/place/")) {
              console.log(`Skipping ${href} (already clicked or no href or not a place)`);
              continue;
            }

            console.log(`Processing: ${href}`);

            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", aEl);
            await driver.executeScript(`window.open("${href}", "_blank");`);
            await driver.sleep(2000);

            // Get all open window handles
            let handles = await driver.getAllWindowHandles();
            if (handles.length < 2) {
              console.warn(`New tab was not opened for ${href}`);
              continue;
            }

            // Switch to the new tab
            await driver.switchTo().window(handles[1]);

            // Execute custom function to extract info
            const info = await driver.executeScript(getInfo);
            console.log(`Extracted info: ${JSON.stringify(info)}`);
            fetchedData.push(info);

            // Mark the link as clicked
            clickedHrefs.add(href);

            // Close the new tab
            await driver.close();
            await driver.sleep(2000);

            // Switch back to the original tab
            await driver.switchTo().window(handles[0]);

          } catch (error) {
            console.error(`Error processing a link: ${error.message}`);
          }
        }

        // Scroll to the last feed to load more content
        const feedDivs = await driver.findElements(By.css(`${feedsSelector} > div`));
        if (feedDivs.length > 0) {
          const lastDiv = feedDivs[feedDivs.length - 1];
          await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", lastDiv);
          await driver.sleep(3000);
        }

        // Check if the end of feeds is reached
        const lastDivText = await feedDivs[feedDivs.length - 1].getText();
        console.log(`Last div text: ${lastDivText}`);
        if (lastDivText.includes("reached the end")) {
          noMoreFeeds = true;
        }
      }

      console.log("No more feeds to process.");
    }

    await scrapeFeeds().catch(console.error);

    // save data as json
    fs.writeFileSync('fetchedData.json', JSON.stringify(fetchedData, null, 2));


    // await driver.sleep(200000);
  } catch (error) {
    console.log(error);
  } finally {
    // Quit the WebDriver
    if (driver) {
      await driver.quit();
    }

    console.log("Process completed");
  }
})();
