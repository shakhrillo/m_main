const findElementsByXPath = require('./findElementsByXPath');

async function clickShowOwnerResponseInOriginalButtons(driver) {
  try {
    const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.showOwnerResponseInOriginal')]]");
    console.log(`Found ${buttons.length} 'Show Owner Response in Original' buttons`);

    for (const button of buttons) {
      try {
        await button.click();
        console.log("Clicked a 'Show Owner Response in Original' button");
      } catch (clickError) {
        console.error("Error clicking button:", clickError);
      }
    }
  } catch (findError) {
    console.error("Error finding buttons:", findError);
  }
}

module.exports = clickShowOwnerResponseInOriginalButtons;
