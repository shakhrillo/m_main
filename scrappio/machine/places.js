"use strict";

require("dotenv").config();
const { By } = require("selenium-webdriver");
const { getDriver } = require("./services/selenium");
const { Timestamp } = require("firebase-admin/firestore");
const { getScriptContent } = require("./services/scripts");
const { getMachineData, updateMachineData, batchWriteLargeArray } = require("./services/firebase");

const tag = process.env.TAG;
if (!tag) throw new Error("Tag not specified");

const getInfoScript = getScriptContent("getInfo.js", "scripts");

const fetchedData = [];

let data = {};

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

    const clickedLinks = new Set();
    const feedSelector = "div[role='feed']";
    let hasMoreFeeds = true;

    while (hasMoreFeeds) {
      const feeds = await driver.findElements(By.css(feedSelector));
      if (feeds.length === 0) break;

      let links = (await Promise.all(feeds.map(feed => feed.findElements(By.tagName("a"))))).flat();

      for (const link of links) {
        try {
          const href = await link.getAttribute("href");
          if (!href || clickedLinks.has(href) || !href.includes("/maps/place/")) {
            console.log(`Skipping link: ${href}`);
            continue;
          }

          await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", link);
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
        } catch (error) {
          console.error(`Error processing link: ${error.message}`);
        }
      }

      const feedDivs = await driver.findElements(By.css(`${feedSelector} > div`));
      if (feedDivs.length) {
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth' });", feedDivs.at(-1));
        await driver.sleep(3000);
      }

      hasMoreFeeds = !!(await feedDivs.at(-1).getText()).includes("reached the end");
    }

    console.log("No more feeds to process.");

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
  } catch (error) {
    console.error(error);
  } finally {
    await updateMachineData(tag, {
      updatedAt: Timestamp.now(),
      status: "completed",
      csvUrl: data.csvUrl || "",
      jsonUrl: data.jsonUrl || "",
      totalPlaces: fetchedData.length,
    });

    if (driver) await driver.quit();
  }
})();
