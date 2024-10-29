const { By } = require('selenium-webdriver');

async function findElementsByXPath(driver, xpath) {
  const elements = await driver.findElements(By.xpath(xpath));

  if (elements.length > 0) {
    return elements;
  }

  return [];
}

module.exports = findElementsByXPath;