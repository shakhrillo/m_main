const { By } = require("selenium-webdriver");

async function reviewTabParentElement(driver) {
  let parentElm = null;
  const vyucnb = await driver.findElements(By.className("vyucnb"));
  if (vyucnb.length > 0) {
    parentElm = await vyucnb[0].findElement(By.xpath("parent::*"));
  }

  return {parentElm};
}

module.exports = reviewTabParentElement;