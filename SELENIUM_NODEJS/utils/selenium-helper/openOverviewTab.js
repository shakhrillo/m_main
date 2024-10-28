const findElementsByXPath = require('./findElementsByXPath');
const getElementAttributes = require('./getElementAttributes');
const getRandomNumber = require('./getRandomNumber');

async function openOverviewTab(driver) {
  const allButtons = await findElementsByXPath(driver, "//button[@role='tab']");
  const attributesToExtract = ['data-tab-index', 'aria-selected'];
  let isOverviewTabSelectedAlready = false;

  for (const button of allButtons) {
    const { 'data-tab-index': dataTabIndex, 'aria-selected': areaSelected } = await getElementAttributes(button, attributesToExtract);
    
    if (dataTabIndex === '0' && areaSelected === 'false') {
      isOverviewTabSelectedAlready = false;
      await button.click();
      await driver.sleep(getRandomNumber(1000, 3000));
      break;
    } else {
      isOverviewTabSelectedAlready = true;
    }
  }

  if (isOverviewTabSelectedAlready) {
    console.log('Already overview tab is selected');
  } else {
    console.log('Opening overview tab');
  }
}

module.exports = openOverviewTab;