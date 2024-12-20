const { Builder, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function getDriver() {
  const options = new chrome.Options();
  // options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
  options.setLoggingPrefs({ browser: "ALL" });
  // options.setChromeBinaryPath("/usr/bin/google-chrome-stable");
  options.excludeSwitches("enable-automation");

  const driver = await new Builder()
    // .usingServer("http://10.128.0.32:4444/wd/hub")
    .setChromeOptions(options)
    .forBrowser(Browser.CHROME)
    .build();

  await driver.manage().setTimeouts({
    implicit: 350000,
    pageLoad: 350000,
    script: 60000,
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
