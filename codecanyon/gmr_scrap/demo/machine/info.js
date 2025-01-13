/**
 * @fileoverview This script automates the process of scraping data from a specified website using Selenium.
 * It captures a screenshot of the website, uploads it to Firebase Storage, and updates Firestore with the scraped data.
 *
 * Key Features:
 * - Fetches data to be scraped from Firestore based on a tag specified in an environment variable.
 * - Extracts the following details from the target website:
 *   - Title
 *   - Address
 *   - Reviews
 *   - Rating
 *   - Screenshot
 * - Updates Firestore with the scraped data.
 * - Uploads the screenshot to Firebase Storage.
 *
 * Environment Variables:
 * - `TAG`: Specifies the machine tag for identifying the data to scrape.
 *
 * Dependencies:
 * - `@firebase/firestore` - For Firestore operations.
 * - `@firebase/storage` - For handling Firebase Storage operations.
 * - `@selenium-webdriver/chrome` - For Chrome browser automation.
 * - `@selenium-webdriver` - Core Selenium WebDriver functionality.
 * - `dotenv` - For managing environment variables.
 *
 * Usage:
 * - Run the script using Node.js:
 *   ```bash
 *   node info.js
 *   ```
 *
 * Version History:
 * - 1.0.0: Initial release with full scraping and data management capabilities.
 *
 * Author:
 * - Shakhrillo
 *
 * License:
 * - This script is licensed under the CodeCanyon Standard License.
 *   See [CodeCanyon Licenses](https://codecanyon.net/licenses/standard) for more details.
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
const { WebDriver } = require("selenium-webdriver");
const {
  uploadFile,
  getMachineData,
  updateMachineData,
} = require("./services/firebase");
const { GeoPoint } = require("firebase-admin/firestore");
const { getDriver } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");
const { log } = require("./services/logger");

// Constants
const tag = process.env.TAG;

// Validate tag
if (!tag) {
  throw new Error("Tag not specified");
}

// Get the script content for extracting information from the page
const getInfo = getScriptContent("getInfo.js", "scripts");

// Get the script content for preparing the page for screenshot
const prepareForScreenshot = getScriptContent(
  "prepareForScreenshot.js",
  "scripts"
);

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
 *   extendedUrl: string,
 *   location: GeoPoint,
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
  log(`Scraping data for tag: ${tag}`);

  try {
    // Fetch machine data
    let dataRetries = 3;
    data = await getMachineData(tag);
    while (!data && dataRetries > 0) {
      log(`Retrying to fetch data for tag: ${tag}`);
      data = await getMachineData(tag);
      dataRetries--;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
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

    // Load the target website
    await driver.get(data.url);
    await driver.sleep(2000);

    /**
     * Execute the script to extract information from the page.
     * @type {{
     *  address: string,
     *  reviews: number,
     *  rating: number,
     *  title: string
     *  error: string
     * }}
     */
    const info = (await driver.executeScript(getInfo)) || {};
    data = {
      ...data,
      ...info,
      title: await driver.getTitle(),
    };
    log(`Extracted data: ${JSON.stringify(info, null, 2)}`);

    // Prepare for screenshot by removing unnecessary elements
    await driver.executeScript(prepareForScreenshot);
    await driver.sleep(2000);

    // Capture a screenshot of the page
    const screenshot = await driver.takeScreenshot();
    const screenshotBuffer = Buffer.from(screenshot, "base64");
    const imageName = `${tag}.png`;
    data.screenshot = await uploadFile(screenshotBuffer, imageName);
    log(`Screenshot uploaded: ${data.screenshot}`);

    data.extendedUrl = await driver.getCurrentUrl();

    // Match the first set of coordinates after '@'
    const atMatch = data.extendedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const lat1 = atMatch ? atMatch[1] : null;
    const lng1 = atMatch ? atMatch[2] : null;

    // Match the second set of coordinates after '3d' and '4d'
    const secondMatch = data.extendedUrl.match(/3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    const lat2 = secondMatch ? secondMatch[1] : null;
    const lng2 = secondMatch ? secondMatch[2] : null;

    data.location = new GeoPoint(
      parseFloat(lat2 || lat1),
      parseFloat(lng2 || lng1)
    );
  } catch (error) {
    data.error = JSON.stringify(error);
    log(`Error: ${error.message}`);
  } finally {
    console.log(JSON.stringify(data, null, 2));
    await updateMachineData(tag, data);
    log(null);
  }
})();
