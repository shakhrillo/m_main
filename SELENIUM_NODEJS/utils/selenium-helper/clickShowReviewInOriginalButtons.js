const findElementsByXPath = require('./findElementsByXPath');

async function clickShowReviewInOriginalButtons(driver) {
  const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.showReviewInOriginal')] and @aria-checked='true']");
  console.log(`Found ${buttons.length} 'Show Review in Original' buttons`);

  for (const button of buttons) {
    await button.click();
  }
}

module.exports = clickShowReviewInOriginalButtons;
