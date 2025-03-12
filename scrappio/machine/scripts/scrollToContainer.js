/**
 * Scroll to the container of the first element in the list
 * @returns {boolean} - Returns true if the container element is found and scrolled to
 */
return (() => {
  const element = document.querySelector(".vyucnb")?.parentElement;

  if (element) {
    const firstChild = element.firstElementChild;
    firstChild?.scrollIntoView();
  } else {
    console.error("Container element not found");
    return false;
  }

  return true;
})();
