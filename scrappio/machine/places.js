"use strict";

require("dotenv").config();
const fs = require('fs');
const { By } = require("selenium-webdriver");
const { getDriver } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");

// Constants
const tag = process.env.TAG || "restaurants+near+Tverskaya+street+Moscow";

// Validate tag
if (!tag) {
  throw new Error("Tag not specified");
}

// Get the script content for extracting information from the page
const getInfo = getScriptContent("getInfo.js", "scripts");

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
    await driver.get(`https://www.google.com/maps/search/${tag}`);
    await driver.sleep(1000);

    let clickedHrefs = new Set();
    const feedsSelector = "div[role='feed']";

    let noMoreFeeds = false;

    while (!noMoreFeeds) {
      // Find all feed elements and add timeout 3sec
      const feeds = await driver.findElements(By.css(feedsSelector));

      if(feeds.length === 0) {
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
          
          if (!href || clickedHrefs.has(href) || !href.includes("https://www.google.com/maps/place/")) {
            console.log(`Skipping ${href} (already clicked or no href or not a place)`);
            continue;
          }

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

  } catch (error) {
    console.log(error);
  } finally {
    fs.writeFileSync('fetchedData.json', JSON.stringify(fetchedData, null, 2));
    
    // Quit the WebDriver
    if (driver) {
      await driver.quit();
    }
  }
})();
