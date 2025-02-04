const findElementsByXPath = require('./findElementsByXPath');
const getElementAttributes = require('./getElementAttributes');
const getRandomNumber = require('./getRandomNumber');

async function openOverviewTab(driver) {
  const allButtons = await findElementsByXPath(driver, "//button[@role='tab']");
  const attributesToExtract = ['data-tab-index', 'aria-selected'];
  
  for (const button of allButtons) {
    const { 'data-tab-index': dataTabIndex, 'aria-selected': ariaSelected } = await getElementAttributes(button, attributesToExtract);
    
    if (dataTabIndex === '0' && ariaSelected === 'false') {
      console.log('Opening overview tab');
      await button.click();
      await driver.sleep(getRandomNumber(1000, 3000));
      return;
    }
  }

  console.log('Overview tab is already selected');
}

module.exports = openOverviewTab;
