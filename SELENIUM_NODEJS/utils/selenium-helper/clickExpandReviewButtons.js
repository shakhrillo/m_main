const findElementsByXPath = require('./findElementsByXPath');

async function clickExpandReviewButtons(driver) {
  try {
    const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.expandReview')] and @aria-expanded='false']");
    console.log(`Found ${buttons.length} expandable review buttons`);

    for (const button of buttons) {
      try {
        await button.click();
        console.log("Clicked an expandable review button");
      } catch (clickError) {
        console.error("Error clicking button:", clickError);
      }
    }
  } catch (findError) {
    console.error("Error finding buttons:", findError);
  }
}

module.exports = clickExpandReviewButtons;
