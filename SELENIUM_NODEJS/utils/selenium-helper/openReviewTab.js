const findElementsByXPath = require('./findElementsByXPath');
const getRandomNumber = require('./getRandomNumber');

async function openReviewTab(driver) {
  const allButtons = await findElementsByXPath(driver, "//button[@role='tab']");
  let isReviewTabSelectedAlready = false;

  for (const button of allButtons) {
    const tabText = await button.getText();
    if (tabText.toLowerCase().includes('reviews')) {
      isReviewTabSelectedAlready = false
      await button.click();
      await driver.sleep(getRandomNumber(1000, 3000));
      break;
    } else {
      isReviewTabSelectedAlready = true;
    }
  }

  if (isReviewTabSelectedAlready) {
    console.log('Already review tab is selected');
  } else {
    console.log('Opening review tab');
  }
}

module.exports = openReviewTab;