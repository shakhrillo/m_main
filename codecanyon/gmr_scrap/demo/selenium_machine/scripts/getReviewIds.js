const nodes =
  document.querySelector(".vyucnb")?.parentElement?.lastChild?.previousSibling
    ?.children || [];

window["initialReviewIds"] = Array.from(nodes)
  .map((node) => node.getAttribute("data-review-id"))
  .filter(Boolean);

return initialReviewIds;
