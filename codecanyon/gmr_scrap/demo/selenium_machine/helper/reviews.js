const fs = require("fs");
const path = require("path");
const { Builder, By, until, WebDriver } = require("selenium-webdriver");

/**
 * Get the initial reviews
 * @param {WebDriver} driver
 */
const sortReviews = async (driver, sortBy = "Newest") => {
  const sortButton = await driver.findElement(
    By.css(
      'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
    )
  );

  await sortButton.click();
  await driver.sleep(1000);

  const menuItems = await driver.findElements(By.css('[role="menuitemradio"]'));
  // console.log("Menu items:", menuItems);
  for (const item of menuItems) {
    const text = await item.getText();
    console.log("Item text:", text);

    if (text === sortBy) {
      await item.click();
      await driver.sleep(1000);
      return;
    }
  }

  console.log("Sort by not found");
};

/**
 * Get the initial reviews
 * @param {WebDriver} driver
 */
const getInitialReviews = async (driver) => {
  return await driver.executeScript(`
    const reviewsContainer = document.querySelector(".vyucnb")?.parentElement?.lastChild?.previousSibling;

    const reviewIds = [];
    const reviewsContainerChildren = reviewsContainer.children;
    for (const reviewElm of reviewsContainerChildren) {
      const reviewId = reviewElm.getAttribute("data-review-id");
      if (reviewId) {
        reviewIds.push(reviewId);
      }
    }

    return reviewIds;
  `);
};

/**
 * Get the initial reviews
 * @param {WebDriver} driver
 */
const watchReviews = async (driver) => {
  // load extracter js file and convert it to string
  const extracterString = fs.readFileSync(
    path.join(__dirname, "extracter.js"),
    "utf8"
  );

  await driver.executeScript(extracterString);

  const isDriverActive = async (driver) => {
    try {
      await driver.getTitle(); // Simple command to test if the session is valid
      return true;
    } catch (error) {
      return false;
    }
  };

  setInterval(async () => {
    if (!(await isDriverActive(driver))) {
      console.error("Driver session is invalid. Terminating interval.");
      return; // Exit if the session is no longer valid
    }

    try {
      const ids = await driver.executeScript(`return window["ids"]`);
      console.log("Review IDs:", ids?.length || 0);
    } catch (error) {
      console.error("Error fetching IDs:", error);
    }

    try {
      const scrollContainerChilds = await driver.executeScript(
        `return window["scrollContainerChilds"]`
      );
      console.log(
        "Scroll container childs:",
        scrollContainerChilds?.length || 0
      );
    } catch (error) {
      console.error("Error fetching scroll container children:", error);
    }
  }, 5000);
};

module.exports = {
  sortReviews,
  getInitialReviews,
  watchReviews,
};
