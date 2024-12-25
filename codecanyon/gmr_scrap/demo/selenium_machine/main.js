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
const ora = require("ora");
const ms = require("ms");
const { WebDriver } = require("selenium-webdriver");
const { getMachineData } = require("./services/firebase");
const { getDriver } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");
const {
  uploadFile,
  batchWriteLargeArray,
  updateMachineData,
} = require("./services/firebase");

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
 *   ownerResponse: boolean,
 *   createdAt: number,
 *   updatedAt: number,
 *   userId: string,
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
};

/**
 * @type {WebDriver | undefined} The Selenium WebDriver instance.
 */
let driver;

// Initialize the spinner
const spinner = ora({
  text: "Scraping reviews...",
  spinner: "dots",
  color: "cyan",
}).start();

// Main function
(async () => {
  try {
    let scrapStartTime = Date.now();

    // Fetch machine data
    data = {
      ...data,
      ...((await getMachineData(tag)) || {}),
    };
    if (!data || !data.url) {
      throw new Error("URL not specified or invalid");
    }
    spinner.text = `Scraping reviews from ${data.url}`;

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

    // Execute the extracter script
    await driver.executeScript(extracter);

    // Open reviews tab
    await driver.executeScript(openReviewsTab);

    // Get review IDs before scrolling
    let extractedReviewIds = await driver.executeScript(getReviewIds);

    const MAX_RETRIES = 20;
    let retries = 0;

    while (extractedReviewIds.length === 0 && retries < MAX_RETRIES) {
      spinner.text = `Retrying to fetch review IDs... (Attempt ${retries + 1})`;
      try {
        extractedReviewIds = await driver.executeScript(getReviewIds);
        await driver.executeScript(scrollToLoader);
        await driver.sleep(400);
        await driver.executeScript(scrollToContainer);
      } catch (error) {
        spinner.text = `Error fetching review IDs: ${error.message}`;
      } finally {
        retries++;
      }
    }

    if (extractedReviewIds.length === 0) {
      await driver.quit();
      throw new Error("No review IDs found");
    } else {
      spinner.text = `Fetched ${extractedReviewIds.length} review IDs`;
      retries = 0;
    }

    // Scroll and extract reviews
    let lastReviewCount = 0;
    while (data.extractedReviews.length < data.limit && retries < MAX_RETRIES) {
      const startTime = Date.now();

      try {
        // Fetch visible elements
        const gmrScrap = await driver.executeScript(checkUpdates);
        Object.assign(data, gmrScrap);

        // Scroll to the loader to load more reviews
        await driver.executeScript(scrollToLoader);

        // Retry if the number of reviews has not changed
        if (data.extractedReviews.length === lastReviewCount) {
          retries += 1;
        } else {
          retries = 0;
        }

        // Stop if the number of retries exceeds the limit or the limit is reached
        if (
          retries > MAX_RETRIES ||
          data.extractedReviews.length >= data.limit
        ) {
          retries = MAX_RETRIES;
        }
      } catch (error) {
        data.error = JSON.stringify(error);
        retries += 1;
      } finally {
        // Update Firestore with the scraped data
        await updateMachineData(tag, {
          totalReviews: data.extractedReviews.length,
        });

        // Set the last review count for comparison
        lastReviewCount = data.extractedReviews.length;

        // Log the progress
        spinner.text = `
          Total Spent Time (s): ${ms(Date.now() - scrapStartTime, {
            long: true,
          })}
          Elapsed Time (s): ${
            ms(Date.now() - startTime, { long: true }) || "< 1s"
          }
          Retries: ${retries}
          Total Reviews: ${data.extractedReviews.length}
        `.replace(/\n\s+/g, "\n");
      }
    }

    // Upload the extracted data to Firestore
    spinner.text = "Uploading data to Firestore...";
    if (data.extractedReviews.length > 0) {
      const jsonContent = JSON.stringify(data.extractedReviews, null, 2);
      const csvContent = [
        Object.keys(data.extractedReviews[0]).join(","),
        ...data.extractedReviews.map((el) => Object.values(el).join(",")),
      ].join("\n");
      data.csvUrl = await uploadFile(csvContent, `csv/${tag}.csv`);
      data.jsonUrl = await uploadFile(jsonContent, `json/${tag}.json`);
    }

    await batchWriteLargeArray(
      `users/${data.userId}/reviews/${data.reviewId}/reviews`,
      data.extractedReviews
    );
    await batchWriteLargeArray(
      `users/${data.userId}/reviews/${data.reviewId}/images`,
      data.extractedImageUrls
    );
    await batchWriteLargeArray(
      `users/${data.userId}/reviews/${data.reviewId}/videos`,
      data.extractedVideoUrls
    );
  } catch (error) {
    data.error = JSON.stringify(error);
    console.error(error);
  } finally {
    updateMachineData(tag, {
      csvUrl: data.csvUrl,
      jsonUrl: data.jsonUrl,
      totalReviews: data.extractedReviews.length || 0,
      totalReviewsScraped: data.totalReviews || 0,
      totalImages: data.extractedImageUrls.length || 0,
      totalOwnerReviews: data.extractedOwnerReviewCount || 0,
      totalUserReviews: data.extractedUserReviewCount || 0,
      status: "completed",
    });

    spinner.stop();
    console.log(
      `Extracted ${data.extractedReviews.length} reviews from ${data.url}`
    );
  }
})();
