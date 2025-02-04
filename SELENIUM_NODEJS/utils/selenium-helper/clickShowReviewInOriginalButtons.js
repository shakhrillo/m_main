const findElementsByXPath = require('./findElementsByXPath');

async function clickShowReviewInOriginalButtons(driver) {
  try {
    const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.showReviewInOriginal')] and @aria-checked='true']");
    console.log(`Found ${buttons.length} 'Show Review in Original' buttons`);

    for (const button of buttons) {
      try {
        await button.click();
        console.log("Clicked a 'Show Review in Original' button");
      } catch (clickError) {
        console.error("Error clicking button:", clickError);
      }
    }
  } catch (findError) {
    console.error("Error finding buttons:", findError);
  }
}

module.exports = clickShowReviewInOriginalButtons;
