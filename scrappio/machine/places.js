"use strict";

require("dotenv").config();
const { By, until } = require("selenium-webdriver");
const { getDriver } = require("./services/selenium");
const { Timestamp, GeoPoint } = require("firebase-admin/firestore");
const { getScriptContent } = require("./services/scripts");
const { getMachineData, updateMachineData, batchWriteLargeArray, uploadFile } = require("./services/firebase");

const tag = process.env.TAG || 'F1FS4k5hTygclFIjtBRM';
if (!tag) throw new Error("Tag not specified");

const searchPlaces = getScriptContent("search.js", "scripts");
const getInfoScript = getScriptContent("getInfo.js", "scripts");

const fetchedData = [];

let data = {};

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

let driver;

(async () => {
  try {
    // Fetch machine data
    let dataRetries = 3;
    data = await getMachineData(tag);
    while (!data && dataRetries > 0) {
      console.log(`Retrying to fetch data for tag: ${tag}`);
      data = await getMachineData(tag);
      dataRetries--;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!data || !data.url) {
      throw new Error("URL not specified or invalid");
    }

    driver = await getDriver({
      timeouts: {
        implicit: Number(process.env.IMPLICIT_TIMEOUT || 60000),
        pageLoad: Number(process.env.PAGE_LOAD_TIMEOUT || 60000),
        script: Number(process.env.SCRIPT_TIMEOUT || 60000),
      },
      chromePath: process.env.CHROME_PATH,
    });

    // Load the target website
    await driver.get(data.url);
    await driver.sleep(2000);

    // Execute the search script
    await driver.executeScript(searchPlaces);

    const clickedLinks = new Set();
    const feedSelector = "div[role='feed']";
    let hasMoreFeeds = true;

    while (hasMoreFeeds) {
      const feeds = await driver.findElements(By.css(feedSelector));
      if (feeds.length === 0) break;

      // let links = (await Promise.all(feeds.map(feed => feed.findElements(By.tagName("a"))))).flat();
      const links = await driver.findElements(By.css(`${feedSelector} a`));
      console.log(`Found ${links.length} links.`);

      for (const link of links) {
        try {
          const href = await link.getAttribute("href");
          if (!href || clickedLinks.has(href) || !href.includes("/maps/place/")) {
            console.log(`Skipping link: ${href}`);
            continue;
          }

          await driver.wait(until.elementIsVisible(link), 5000);
          await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", link);
          await driver.sleep(2000);
          await driver.executeScript(`window.open("${href}", "_blank");`);
          await driver.sleep(2000);

          const handles = await driver.getAllWindowHandles();
          if (handles.length < 2) continue;

          await driver.switchTo().window(handles[1]);
          const info = await driver.executeScript(getInfoScript);
          fetchedData.push(info);
          clickedLinks.add(href);
          console.log(`Fetched data for: ${href}`);

          await driver.close();
          await driver.sleep(2000);
          await driver.switchTo().window(handles[0]);

          const screenshot = await takeScreenshot();
          screenshots.push({
            url: screenshot,
            createdAt: Timestamp.now(),
          });
        } catch (error) {
          console.error(`Error processing link: ${error.message}`);
        }
      }

      const feedDivs = await driver.findElements(By.css(`${feedSelector} > div`));
      console.log(`Found ${feedDivs.length} feeds.`);
      if (feedDivs.length) {
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", feedDivs.at(-1));
        await driver.sleep(3000);
      }

      const lastTxt = await feedDivs.at(-1).getText();

      console.log(`----> ${lastTxt}`)

      // hasMoreFeeds = !lastTxt.includes("reached the end");
      hasMoreFeeds = false;
    }
    console.log("No more feeds to process.");

    // Get the extended URL
    data.extendedUrl = await driver.getCurrentUrl();

    // Match the first set of coordinates after '@'
    const atMatch = data.extendedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const lat1 = atMatch ? atMatch[1] : null;
    const lng1 = atMatch ? atMatch[2] : null;

    // Match the second set of coordinates after '3d' and '4d'
    const secondMatch = data.extendedUrl.match(/3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    const lat2 = secondMatch ? secondMatch[1] : null;
    const lng2 = secondMatch ? secondMatch[2] : null;

    // Set the location based on the coordinates
    data.location = new GeoPoint(
      parseFloat(lat2 || lat1),
      parseFloat(lng2 || lng1)
    );

    // Upload the extracted data to Firestore
    console.log("Uploading data to Firestore...");
    if (fetchedData.length > 0) {
      const jsonContent = JSON.stringify(fetchedData, null, 2);
      const csvContent = [
        Object.keys(fetchedData[0]).join(","),
        ...fetchedData.map((el) => Object.values(el).join(",")),
      ].join("\n");
      if (data["outputAs"] === "csv") {
        data.csvUrl = await uploadFile(csvContent, `csv/${tag}.csv`);
      }
      if (data["outputAs"] === "json") {
        data.jsonUrl = await uploadFile(jsonContent, `json/${tag}.json`);
      }
    }

    await batchWriteLargeArray(
      `containers/${data.id}/places`,
      fetchedData,
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
    await updateMachineData(tag, {
      ...data,
      updatedAt: Timestamp.now(),
      status: "completed",
      totalPlaces: fetchedData.length,
    });

    if (driver) await driver.quit();
  }
})();
