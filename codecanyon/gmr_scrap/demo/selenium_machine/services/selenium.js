const { Builder, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function getDriver() {
  const options = new chrome.Options();
  options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
  options.setLoggingPrefs({ browser: "ALL" });
  if (process.env.NODE_ENV !== "test") {
    options.setChromeBinaryPath("/usr/bin/chromium");
  }
  options.excludeSwitches("enable-automation");

  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: 3000,
    pageLoad: 180000,
    script: 180000,
  });

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

module.exports = {
  getDriver,
  isDriverActive,
};
