"use strict";

// Load environment variables from the .env file
require("dotenv").config();

// Import dependencies
const { WebDriver } = require("selenium-webdriver");
const { Timestamp, FieldValue, GeoPoint } = require("firebase-admin/firestore");
const { uploadFile, getMachineData, updateMachineData, updateUserData, settingsService, batchWriteLargeArray } = require("./services/firebase");
const { getDriver, getSeleniumDetails } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");

let driver;

(async () => {
  // console.log(`Scraping data for tag: ${tag}`);

  try {
    // Fetch machine data
    // let dataRetries = 3;
    // data = await getMachineData(tag);
    // while (!data && dataRetries > 0) {
    //   console.log(`Retrying to fetch data for tag: ${tag}`);
    //   data = await getMachineData(tag);
    //   dataRetries--;
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // }
    // if (!data || !data.url) {
    //   throw new Error("URL not specified or invalid");
    // }

    // Initialize Selenium WebDriver
    driver = await getDriver({
      timeouts: {
        implicit: Number(process.env.IMPLICIT_TIMEOUT || 60000), // For locating elements (milliseconds)
        pageLoad: Number(process.env.PAGE_LOAD_TIMEOUT || 60000), // For page load (milliseconds)
        script: Number(process.env.SCRIPT_TIMEOUT || 60000), // For executing scripts (milliseconds)
      },
      // chromePath: process.env.CHROME_PATH,
    });

    // Load the target website
    await driver.get("https://www.indeed.com/jobs?q=software+developer&l=remote&vjk=f8e02181d39ad2b9");
    await driver.sleep(200000);
  } catch (error) {
    console.error(error);
    await driver?.quit();
    process.exit(1);
  }
})();