const fs = require("fs");
const { Builder, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function getDriver({
  timeouts = { implicit: 60000, pageLoad: 60000, script: 60000 },
}) {
  const options = new chrome.Options();
  options.setLoggingPrefs({ browser: "ALL" });
  const chromePath = "/usr/bin/chromium-browser";
  if (fs.existsSync(chromePath)) {
    options.setChromeBinaryPath(chromePath);
    options.addArguments(
      "--headless",
      "--no-sandbox",
      "--disable-dev-shm-usage"
    );
  } else {
    console.error("Chrome path not found:", chromePath);
  }
  options.excludeSwitches("enable-automation");

  const driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser(Browser.CHROME)
    .build();

  await driver.manage().setTimeouts(timeouts);

  return driver;
}

async function isDriverActive(driver) {
  try {
    await driver.getTitle();
    return true;
  } catch (error) {
    return false;
  }
}

async function quitDriver(driver) {
  if (isDriverActive(driver)) {
    await driver.quit();
  }
}

module.exports = {
  getDriver,
  isDriverActive,
  quitDriver,
};
