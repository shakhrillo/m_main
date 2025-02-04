const findElementsByXPath = require('./findElementsByXPath');
const getRandomNumber = require('./getRandomNumber');

async function openReviewTab(driver) {
  const allButtons = await findElementsByXPath(driver, "//button[@role='tab']");

  for (const button of allButtons) {
    const tabText = await button.getText();
    if (tabText.toLowerCase().includes('reviews')) {
      console.log('Opening review tab');
      await button.click();
      await driver.sleep(getRandomNumber(1000, 3000));
      return;
    }
  }

  console.log('Review tab is already selected');
}

module.exports = openReviewTab;
