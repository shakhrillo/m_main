const findElementsByXPath = require('./findElementsByXPath');

async function clickExpandReviewButtons(driver) {
  const buttons = await findElementsByXPath(driver, "//button[@jsaction[contains(., 'review.expandReview')] and @aria-expanded='false']");
  console.log(`Found ${buttons.length} expandable review buttons`);

  for (const button of buttons) {
    await button.click();
  }
}

module.exports = clickExpandReviewButtons;
