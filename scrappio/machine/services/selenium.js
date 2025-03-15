/**
 * @fileoverview Driver management functions for Selenium WebDriver.
 *
 * Version History:
 * - 1.0.0: Initial release with driver management functions.
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

// Import dependencies
const fs = require("fs");
const { Builder, Browser, WebDriver, logging } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

/**
 * Get a new WebDriver instance.
 * @param {Object} options - The WebDriver options.
 * @param {Object} options.timeouts - The WebDriver timeouts.
 * @param {number} options.timeouts.implicit - The implicit timeout (milliseconds).
 * @param {number} options.timeouts.pageLoad - The page load timeout (milliseconds).
 * @param {number} options.timeouts.script - The script timeout (milliseconds).
 * @param {string} options.chromePath - The path to the Chrome binary.
 * @returns {Promise<WebDriver>} The WebDriver instance.
 */
async function getDriver({
  timeouts = {
    implicit: 60000, // For locating elements (milliseconds)
    pageLoad: 60000, // For page load (milliseconds)
    script: 60000, // For executing scripts (milliseconds)
  },
  // chromePath = "/usr/bin/chromium-browser",
}) {
  const options = new chrome.Options();
  
  let loggingPrefs = new logging.Preferences();
  loggingPrefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
  options.setLoggingPrefs(loggingPrefs);

  // options.addArguments(
  //   "--headless", // Run in headless mode
  //   "--no-sandbox", // Bypass OS security model
  //   "--disable-dev-shm-usage" // Avoid /dev/shm usage
  // );
  // Check if Chrome binary exists
  // if (fs.existsSync(chromePath)) {
  //   options.setChromeBinaryPath(chromePath);
  // } else {
  //   throw new Error("Chrome binary not found");
  // }
  options.excludeSwitches("enable-automation"); // Disable automation message

  // Initialize WebDriver
  const driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser(Browser.CHROME)
    .build();

  // Set timeouts
  await driver.manage().setTimeouts(timeouts);

  return driver;
}

async function getSeleniumDetails(driver) {
  const capabilities = await driver.getCapabilities();
  const details = {
    browserName: capabilities.get("browserName") || "Chrome",
    browserVersion: capabilities.get("browserVersion") || "Unknown",
    platformName: capabilities.get("platformName") || "Unknown",
    platformVersion: capabilities.get("platformVersion") || "Unknown",
  };

  const browserConsoles = await driver.manage().logs().get("browser");
  details.browserLogs = browserConsoles.map(log => ({
    level: log?.level?.name || "Unknown",
    message: log?.message || "",
  })) || [];

  return details;
}

module.exports = {
  getDriver,
  getSeleniumDetails,
};
