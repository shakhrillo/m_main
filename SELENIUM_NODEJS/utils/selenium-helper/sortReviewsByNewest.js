const { By } = require('selenium-webdriver');

async function sortReviewsByNewest(driver) {
  try {
    // Locate the Sort Reviews button
    const sortButton = await driver.findElements(By.xpath("//button[@aria-label='Sort reviews']"));
    
    // Click the Sort Reviews button if it exists
    if (sortButton.length > 0) {
      await sortButton[0].click();
      await driver.sleep(2000); // Give time for menu to load
      
      // Locate menu items with role="menuitemradio"
      const menuItems = await driver.findElements(By.xpath("//div[@role='menuitemradio']"));
      
      for (const item of menuItems) {
        const text = await item.getText();
        
        // Click on the menu item if it includes 'newest'
        if (text.toLowerCase().includes('newest')) {
          await item.click();
          break;
        }
      }
    }
  } catch (error) {
    console.error('Error in sorting reviews:', error);
  }
}

module.exports = sortReviewsByNewest;
