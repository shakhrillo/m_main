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
const { By, WebElement } = require("selenium-webdriver");
const {
  uploadFile,
  getMachineData,
  updateMachineData,
} = require("./services/firebase");
const { getDriver } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");

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

// Initialize data object
let data = {};

(async () => {
  try {
    // Fetch machine data
    data = await getMachineData(tag);
    if (!data || !data.url) {
      throw new Error("URL not specified or invalid");
    }

    // Initialize Selenium WebDriver
    const driver = await getDriver({
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

    //
    const info = (await driver.executeScript(getInfo)) || {};
    data = {
      ...data,
      ...info,
    };

    // Prepare for screenshot
    await driver.executeScript(prepareForScreenshot);
    await driver.sleep(2000);
    const screenshot = await driver.takeScreenshot();
    const screenshotBuffer = Buffer.from(screenshot, "base64");
    data.screenshot = await uploadFile(
      screenshotBuffer,
      `${tag}/screenshot.png`
    );
  } catch (err) {
    data.error = JSON.stringify(err);
    console.error("Error:", err);
  } finally {
    await updateMachineData(tag, data);
    console.log(JSON.stringify(data, null, 2));
  }
})();
