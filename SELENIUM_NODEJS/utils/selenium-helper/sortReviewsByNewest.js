const { By } = require('selenium-webdriver');

async function sortReviewsByNewest(driver) {
  try {
    // Locate and click the Sort Reviews button
    const sortButton = await driver.findElements(By.xpath("//button[@aria-label='Sort reviews' or @aria-label='Most relevant']"));
    
    if (sortButton.length > 0) {
      await sortButton[0].click();
      await driver.sleep(2000); // Allow menu time to load
      
      // Locate and click the 'Newest' menu item
      const menuItems = await driver.findElements(By.xpath("//div[@role='menuitemradio']"));
      
      for (const item of menuItems) {
        if ((await item.getText()).toLowerCase().includes('newest')) {
          await item.click();
          break;
        }
      }
    } else {
      console.log('Sort button not found');
    }
  } catch (error) {
    console.error('Error in sorting reviews:', error);
  }
}

module.exports = sortReviewsByNewest;
