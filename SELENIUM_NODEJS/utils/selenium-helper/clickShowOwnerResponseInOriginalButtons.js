const findElementsByXPath = require('./findElementsByXPath');

async function clickShowOwnerResponseInOriginalButtons(driver) {
  const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.showOwnerResponseInOriginal')]]");
  
  console.log(`Found ${buttons.length} 'Show Owner Response in Original' buttons`);

  for (const button of buttons) {
    await button.click();
  }
}

module.exports = clickShowOwnerResponseInOriginalButtons;
