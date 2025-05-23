/**
 * @fileoverview This script automates the process of scraping comments from a specified website using Selenium.
 * It navigates to the website, extracts comments, and updates Firestore with the scraped data.
 *
 * Key Features:
 * - Fetches data to be scraped from Firestore based on a tag specified in an environment variable.
 * - Extracts comments from the target website.
 * - Updates Firestore with the scraped data.
 *
 * Environment Variables:
 * - `TAG`: Specifies the machine tag for identifying the data to scrape.
 *
 * Dependencies:
 * - `@selenium-webdriver` - Core Selenium WebDriver functionality.
 * - `dotenv` - For managing environment variables.
 *
 * Usage:
 * - Run the script using Node.js:
 *  ```bash
 * node main.js
 * ```
 *
 * Version History:
 * - 1.0.0: Initial release with full scraping capabilities.
 *
 * Author:
 * - Shakhrillo
 *
 * License:
 * - This script is licensed under the CodeCanyon Standard License.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author Shakhrillo
 * @license CodeCanyon Standard License
 */

"use strict";

// Load environment variables from the .env file
require("dotenv").config();

// Import dependencies
const ms = require("ms");
const { WebDriver } = require("selenium-webdriver");
const { Timestamp, FieldValue } = require("firebase-admin/firestore");
const { getMachineData, updateUserData, settingsService } = require("./services/firebase");
const { getDriver, getSeleniumDetails } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");
const { uploadFile, batchWriteLargeArray, updateMachineData } = require("./services/firebase");
const generateSearchKeywords = require("./utils/generateSearchKeywords");

// Constants
const tag = process.env.TAG;

// Validate tag
if (!tag) {
  throw new Error("Tag not specified");
}

const openReviewsTab = getScriptContent("openReviewsTab.js", "scripts");
const extracter = getScriptContent("extracter.js", "scripts");
const checkUpdates = getScriptContent("checkUpdates.js", "scripts");
const getReviewIds = getScriptContent("getReviewIds.js", "scripts");
const scrollToLoader = getScriptContent("scrollToLoader.js", "scripts");
const scrollToContainer = getScriptContent("scrollToContainer.js", "scripts");

/**
 * @type {{
 *   url: string,
 *   limit: number,
 *   sortBy: string,
 *   extractVideoUrls: boolean,
 *   extractImageUrls: boolean,
 *   extractOwnerResponse: boolean,
 *   createdAt: number,
 *   updatedAt: number,
 *   uid: string,
 *   reviewId: string,
 *   address: string,
 *   reviews: number,
 *   rating: number,
 *   screenshot: string,
 *   title: string,
 *   extractedImageUrls: string[],
 *   extractedVideoUrls: string[],
 *   extractedOwnerReviewCount: number,
 *   extractedUserReviewCount: number,
 *   extractedReviews: any[],
 *   retriesCount: number,
 * }}
 * The machine data object.
 */
let data = {
  extractedImageUrls: [],
  extractedVideoUrls: [],
  extractedOwnerReviewCount: 0,
  extractedUserReviewCount: 0,
  extractedReviews: [],
  retriesCount: 0,
  maxSpentPointsDefault: 0,
};

/**
 * @type {WebDriver | undefined} The Selenium WebDriver instance.
 */
let driver;

/**
 * Takes a screenshot of the current page and uploads it to Firebase Storage.
 * @returns {Promise<string>} The URL of the uploaded screenshot.
 */
async function takeScreenshot() {
  try {
    const screenshot = await driver.takeScreenshot();
    const screenshotBuffer = Buffer.from(screenshot, "base64");
    const uniqueId = Math.random().toString(36).substring(7);
    const imageName = `${tag}-${uniqueId}.png`;
    const url = await uploadFile(screenshotBuffer, imageName);
    return url;
  } catch (error) {
    console.error(`Error taking screenshot: ${error.message}`);
    return "";
  }
}

// Screenshots array
const screenshots = [];

// Main function
(async () => {
  console.log("Scraping reviews...");

  updateMachineData(tag, {
    updatedAt: Timestamp.now(),
    status: "in-progress",
  });

  try {
    let scrapStartTime = Date.now();

    // Fetch machine data
    data = {
      ...data,
      ...((await getMachineData(tag)) || {}),
      price: {
        review: await settingsService("review", "coin") || 0,
        image: await settingsService("image", "coin") || 0,
        video: await settingsService("video", "coin") || 0,
        response: await settingsService("response", "coin") || 0,
      }
    };

    data.maxSpentPointsDefault = data.maxSpentPoints || 0;
    if (!data || !data.url) {
      throw new Error("URL not specified or invalid");
    }
    console.log(`Scraping reviews from ${data.url}`);

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
    await driver.get(data.url);
    await driver.sleep(2000);

    // Execute the script to set the global variable
    await driver.executeScript(
      `window.gmrScrap = ${JSON.stringify(data, null, 2)}`
    );

    // Set global generateSearchKeywords function
    await driver.executeScript(
      `window.generateSearchKeywords = ${generateSearchKeywords.toString()}`
    );

    // Execute the extracter script
    await driver.executeScript(extracter);

    // Open reviews tab
    await driver.executeScript(openReviewsTab);

    // Get review IDs before scrolling
    let extractedReviewIds = await driver.executeScript(getReviewIds);

    const MAX_RETRIES = 100;
    let retries = 0;

    while (extractedReviewIds.length === 0 && retries < MAX_RETRIES) {
      try {
        extractedReviewIds = await driver.executeScript(getReviewIds);
        await driver.executeScript(scrollToLoader);
        await driver.sleep(400);
        await driver.executeScript(scrollToContainer);
      } catch (error) {
        const screenshot = await takeScreenshot();
        screenshots.push({
          url: screenshot,
          createdAt: Timestamp.now(),
        });
        console.log(`Error fetching review IDs: ${error.message}`);
      } finally {
        retries++;
      }
    }

    console.log(`Retrying to fetch review IDs... (Attempt ${retries + 1})`);
    updateMachineData(tag, {
      updatedAt: Timestamp.now(),
      status: "in-progress",
    });

    if (extractedReviewIds.length === 0) {
      const screenshot = await takeScreenshot();
      screenshots.push({
        url: screenshot,
        createdAt: Timestamp.now(),
      });
      await driver.quit();
      throw new Error("No review IDs found");
    } else {
      console.log(`Fetched ${extractedReviewIds.length} review IDs`);
      retries = 0;
    }

    // Scroll and extract reviews
    let lastReviewCount = 0;
    const startTime = Date.now();
    while (data.extractedReviews.length < data.limit && retries < MAX_RETRIES) {

      try {
        // Fetch visible elements
        const gmrScrap = await driver.executeScript(checkUpdates);
        Object.assign(data, gmrScrap);

        // Retry if the number of reviews has not changed
        if (data.extractedReviews.length === lastReviewCount) {
          retries += 1;

          // Scroll to the loader and container elements to trigger the next batch of reviews
          await driver.executeScript(scrollToLoader);
          await driver.sleep(1000);
          await driver.executeScript(scrollToContainer);
        } else {
          retries = 0;
        }

        // Stop if the number of retries exceeds the limit or the limit is reached
        if (
          retries > MAX_RETRIES ||
          data.extractedReviews.length >= data.limit ||
          data.reviews <= data.extractedReviews.length ||
          data.maxSpentPoints <= 0
        ) {
          retries = MAX_RETRIES;
        }
      } catch (error) {
        data.error = JSON.stringify(error);
        try {
          // Take a screenshot
          const screenshot = await takeScreenshot();
          screenshots.push({
            url: screenshot,
            createdAt: Timestamp.now(),
          });
          await driver.sleep(1000);
        } catch (error) {
          console.log(`Error fetching browser logs: ${error.message}`);
        }

        retries += 1;
      } finally {
        // Update Firestore with the scraped data
        await updateMachineData(tag, {
          totalReviews: data.extractedReviews.length,
        });

        // Set the last review count for comparison
        lastReviewCount = data.extractedReviews.length;

        updateMachineData(tag, {
          updatedAt: Timestamp.now(),
          status: "in-progress",
        });
      }
    }

    // Log the progress
    console.log(
      `
        Total Spent Time (s): ${ms(Date.now() - scrapStartTime, {
          long: true,
        })}
        Elapsed Time (s): ${
          ms(Date.now() - startTime, { long: true }) || "< 1s"
        }
        Retries: ${retries}
        Total Reviews: ${data.extractedReviews.length}
        Error: ${data.error || "None"}
      `.replace(/\n\s+/g, "\n")
    );

    // Upload the extracted data to Firestore
    console.log("Uploading data to Firestore...");
    if (data.extractedReviews.length > 0) {
      const jsonContent = JSON.stringify(data.extractedReviews, null, 2);
      const csvContent = [
        Object.keys(data.extractedReviews[0]).join(","),
        ...data.extractedReviews.map((el) => Object.values(el).join(",")),
      ].join("\n");
      if (data["outputAs"] === "csv") {
        data.csvUrl = await uploadFile(csvContent, `csv/${tag}.csv`);
      }
      if (data["outputAs"] === "json") {
        data.jsonUrl = await uploadFile(jsonContent, `json/${tag}.json`);
      }
    }

    // Take a screenshot
    const screenshot = await takeScreenshot();
    screenshots.push({
      url: screenshot,
      createdAt: Timestamp.now(),
    });

    // Get browser details
    const details = await getSeleniumDetails(driver);
    
    data.browser = {
      browserName: details.browserName,
      browserVersion: details.browserVersion,
      platformName: details.platformName,
      platformVersion: details.platformVersion,
    }

    await batchWriteLargeArray(
      `machines/${data.id}/browserLogs`,
      details.browserLogs
    );

    await batchWriteLargeArray(
      `containers/${data.id}/reviews`,
      data.extractedReviews
    );
    await batchWriteLargeArray(
      `containers/${data.id}/images`,
      data.extractedImageUrls
    );
    await batchWriteLargeArray(
      `containers/${data.id}/videos`,
      data.extractedVideoUrls
    );
    await batchWriteLargeArray(
      `machines/${data.id}/screenshots`,
      screenshots
    );
  } catch (error) {
    data.status = "error";
    data.error = JSON.stringify(error);
    console.error(error);
  } finally {
    const totalSpentPoints = data.maxSpentPointsDefault - data.maxSpentPoints;
    updateMachineData(tag, {
      csvUrl: data.csvUrl || "",
      jsonUrl: data.jsonUrl || "",
      totalReviews: data.extractedReviews.length || 0,
      totalImages: data.extractedImageUrls.length || 0,
      totalVideos: data.extractedVideoUrls.length || 0,
      totalOwnerReviews: data.extractedOwnerReviewCount || 0,
      totalSpentPoints,
      updatedAt: Timestamp.now(),
      status: "completed",
      browser: data.browser,
    });

    try {
      await updateUserData(data.uid, {
        coinBalance: FieldValue.increment(-totalSpentPoints),
        totalReviews: FieldValue.increment(data.extractedReviews.length),
        totalImages: FieldValue.increment(data.extractedImageUrls.length),
        totalVideos: FieldValue.increment(data.extractedVideoUrls.length),
        totalOwnerReviews: FieldValue.increment(data.extractedOwnerReviewCount),
        totalValidateComments: FieldValue.increment(1),
      });
    } catch (error) {
      console.error(error);
    }

    // Quit the WebDriver
    if (driver) {
      await driver.quit();
    }
    
    console.log(
      `Extracted ${data.extractedReviews.length} reviews from ${data.url}`
    );
  }
})();
