/**
 * Scroll to the loader element
 * @returns {boolean} - Returns true if the loader element is found and scrolled to
 */
return (() => {
  const element = document.querySelector(".vyucnb")?.parentElement;

  if (element) {
    const lastChild = element.lastElementChild;
    lastChild?.scrollIntoView();
  } else {
    console.error("Loader element not found");
    return false;
  }

  return true;
})();
