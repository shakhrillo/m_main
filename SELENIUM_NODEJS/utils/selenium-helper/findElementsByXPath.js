const { By } = require('selenium-webdriver');

async function findElementsByXPath(driver, xpath) {
  return await driver.findElements(By.xpath(xpath));
}

module.exports = findElementsByXPath;