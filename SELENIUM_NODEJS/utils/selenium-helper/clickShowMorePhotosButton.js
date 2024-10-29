const findElementsByXPath = require('./findElementsByXPath');

async function clickShowMorePhotosButton(driver) {
  const buttons = await findElementsByXPath(driver, "//button[contains(@jsaction, 'review.showMorePhotos')]");
  console.log(`Found ${buttons.length} 'Show More Photos' buttons`);
  
  for (const button of buttons) {
    await button.click();
  }
}

module.exports = clickShowMorePhotosButton;
