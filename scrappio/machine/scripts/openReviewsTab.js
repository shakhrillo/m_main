/**
 * Open the reviews tab and sort the reviews by the given option. This script is meant to be executed in the browser.
 *
 * @param {Object} gmrScrap - The GMR Scrap object.
 * @returns {Promise<void>}
 */
return (async () => {
  // Open the reviews tab
  const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
  const reviewsTab = tabs.find((tab) =>
    tab.innerText.trim().toLowerCase().includes("reviews")
  );

  if (!reviewsTab) {
    throw new Error("Reviews tab is not available");
  }

  reviewsTab.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Sort the reviews
  const sortButton = document.querySelector(
    'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
  );

  if (!sortButton) {
    throw new Error("Sort button not found");
  }

  sortButton.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const menuItems = document.querySelectorAll('[role="menuitemradio"]');
  let isOptionFound = false;

  for (const item of menuItems) {
    const text = item.innerText.trim();

    if (text === gmrScrap.sortBy) {
      item.click();
      console.log("Sorting by:", gmrScrap.sortBy);
      isOptionFound = true;
      break;
    }
  }

  if (!isOptionFound) {
    throw new Error(`Sort option "${gmrScrap.sortBy}" not found`);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
})();
