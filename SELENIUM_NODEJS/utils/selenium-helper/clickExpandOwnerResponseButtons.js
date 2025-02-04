const findElementsByXPath = require('./findElementsByXPath');

async function clickExpandOwnerResponseButtons(driver) {
  try {
    const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.expandOwnerResponse')] and @aria-expanded='false']");
    console.log(`Found ${buttons.length} expandable owner response buttons`);

    for (const button of buttons) {
      try {
        await button.click();
        console.log("Clicked an expandable owner response button");
      } catch (clickError) {
        console.error("Error clicking button:", clickError);
      }
    }
  } catch (findError) {
    console.error("Error finding buttons:", findError);
  }
}

module.exports = clickExpandOwnerResponseButtons;
