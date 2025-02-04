(async () => {
  "use strict";

  // Utility function to remove an element by selector
  const removeElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) element.remove();
  };

  // Utility function to click all buttons matching a selector
  const clickAllButtons = (selector) => {
    document.querySelectorAll(selector).forEach((button) => button.click());
  };

  // Remove unnecessary elements
  removeElement("#minimap");
  removeElement(".app-viewcard-strip");
  removeElement("#gb");
  removeElement(".scene-footer-container");

  // Collapse side panel buttons
  clickAllButtons("button[aria-label='Collapse side panel']");

  // Remove the side panel toggle button after a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  removeElement("button[jsaction*='drawer.open']");
})();
