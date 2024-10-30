const findElementsByXPath = require('./findElementsByXPath');

async function clickShowMorePhotosButton(driver) {
  try {
    const buttons = await findElementsByXPath(driver, "//button[contains(@jsaction, 'review.showMorePhotos')]");
    console.log(`Found ${buttons.length} 'Show More Photos' buttons`);
    
    for (const button of buttons) {
      try {
        await button.click();
        console.log("Clicked a 'Show More Photos' button");
      } catch (clickError) {
        console.error("Error clicking button:", clickError);
      }
    }
  } catch (findError) {
    console.error("Error finding buttons:", findError);
  }
}

module.exports = clickShowMorePhotosButton;
