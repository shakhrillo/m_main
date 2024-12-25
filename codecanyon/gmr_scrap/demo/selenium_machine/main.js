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
const { By, WebDriver } = require("selenium-webdriver");
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

const extracterString = getScriptContent("extracter.js", "scripts");
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
 *   error: string
 * }}
 * The machine data object.
 */
let data = {};

/**
 * @type {WebDriver | undefined} The Selenium WebDriver instance.
 */
let driver;

(async () => {
  try {
    // Fetch machine data
    data = await getMachineData(tag);
    if (!data || !data.url) {
      throw new Error("URL not specified or invalid");
    }

    // Initialize Selenium WebDriver
    driver = await getDriver({
      timeouts: {
        implicit: Number(process.env.IMPLICIT_TIMEOUT || 60000), // For locating elements (milliseconds)
        pageLoad: Number(process.env.PAGE_LOAD_TIMEOUT || 60000), // For page load (milliseconds)
        script: Number(process.env.SCRIPT_TIMEOUT || 60000), // For executing scripts (milliseconds)
      },
      chromePath: process.env.CHROME_PATH,
    });

    // ----------------- Start the process -----------------
    await driver.get(data.url);
    console.log("URL:", data.url);
    await driver.sleep(2000);

    // ----------------- Set config -----------------
    await driver.executeScript(
      `window.gmrScrap = ${JSON.stringify(
        {
          ...data,
          extractedImageUrls: [],
          extractedVideoUrls: [],
          extractedOwnerReviewCount: 0,
          extractedUserReviewCount: 0,
        },
        null,
        2
      )}`
    );

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
    let extractedReviewIds = (await driver.executeScript(getReviewIds)) || [];
    let retries = 0;

    console.log("Initial review ids", extractedReviewIds.length);
    while (extractedReviewIds.length === 0 && retries < 10) {
      try {
        console.log("Retrying to fetch review IDs...");
        extractedReviewIds = await driver.executeScript(getReviewIds);
        await driver.executeScript(scrollToLoader);
        await driver.sleep(2000);
        await driver.executeScript(scrollToContainer);
      } catch (error) {
        console.error("Error in while loop", error);
      } finally {
        retries++;
      }
    }
    console.log("Scrolledintials", extractedReviewIds.length);

    if (extractedReviewIds.length === 0) {
      console.log("No review IDs found. Exiting...");
      driver.quit();
      return;
    }

    // ----------------- Watch the reviews -----------------
    await driver.executeScript(extracterString);

    data.extractedReviews = [];
    data.retriesCount = 0;

    while (
      data.extractedReviews.length < data.limit &&
      data.retriesCount < 20
    ) {
      let startedTime = Date.now();
      try {
        let visibleElements = await driver.executeScript(
          `return fetchVisibleElements()`
        );
        await driver.sleep(400);
        console.log("Visible elements:", visibleElements.length);

        if (visibleElements.length === 0) {
          data.retriesCount++;
          visibleElements = await driver.executeScript(
            `return fetchVisibleElements()`
          );
        } else {
          data.retriesCount = 0;
        }

        if (data.retriesCount > 20) {
          console.log("Retries exceeded. Exiting...");
          break;
        }

        data.extractedReviews.push(...visibleElements);

        await updateMachineData(tag, {
          totalReviews: data.extractedReviews.length,
        });

        if (data.extractedReviews.length >= data.limit) {
          break;
        }

        data = {
          ...data,
          ...(await driver.executeScript(`return window.gmrScrap`)),
        };
      } catch (error) {
        data.retriesCount++;
        console.error("Error in while loop");
      } finally {
        console.log(
          `Elapsed time: (${Math.round(
            (Date.now() - startedTime) / 1000
          )} seconds)`
        );
        console.log("Retries:", data.retriesCount);
        console.log("Total reviews:", data.extractedReviews.length);
        console.log("-".repeat(20));
      }
    }

    // ----------------- Complete -----------------
    console.log("-".repeat(20));
    console.log("Completed");
    console.log("-".repeat(20));

    let csvUrl = "";
    let jsonUrl = "";
    if (data.extractedReviews.length > 0) {
      const jsonContent = JSON.stringify(data.extractedReviews, null, 2);
      const csvContent = [
        Object.keys(data.extractedReviews[0]).join(","),
        ...data.extractedReviews.map((el) => Object.values(el).join(",")),
      ].join("\n");
      csvUrl = await uploadFile(csvContent, `csv/${tag}.csv`);
      jsonUrl = await uploadFile(jsonContent, `json/${tag}.json`);
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

    // data.extractedReviews
    console.table(data.extractedReviews.slice(0, 5));
  }
})();
