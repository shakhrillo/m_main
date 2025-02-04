/**
 * Get review ids from the page
 * @returns {string[]} Review ids
 */
return (() => {
  const nodes =
    document.querySelector(".vyucnb")?.parentElement?.lastChild?.previousSibling
      ?.children || [];

  return Array.from(nodes)
    .map((node) => node.getAttribute("data-review-id"))
    .filter(Boolean);
})();
