(async () => {
  const tabs = document.querySelectorAll('button[role="tab"]');
  for (const tab of tabs) {
    const tabText = tab.innerText;
    if (tabText.toLowerCase().includes("reviews")) {
      tab.click();
      break;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const sortButton = document.querySelector(
    'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
  );
  if (sortButton) {
    sortButton.click();
    await new Promise((resolve) => setTimeout(resolve, 400));

    const menuItems = document.querySelectorAll('[role="menuitemradio"]');
    for (const item of menuItems) {
      const text = item.innerText;

      if (text === data.sortBy) {
        item.click();
        console.log("Sorting by:", data.sortBy);
        break;
      }
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
})();
