const findElementsByXPath = require('./findElementsByXPath');

async function clickExpandOwnerResponseButtons(driver) {
  const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.expandOwnerResponse')] and @aria-expanded='false']");
  
  console.log(`Found ${buttons.length} expandable owner response buttons`);

  for (const button of buttons) {
    await button.click();
  }
}

module.exports = clickExpandOwnerResponseButtons;
