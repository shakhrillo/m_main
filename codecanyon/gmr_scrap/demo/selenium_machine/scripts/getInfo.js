const tabs = [...document.querySelectorAll('button[role="tab"]')];
const hasReviewsTab = tabs.some((tab) =>
  tab.innerText.toLowerCase().includes("reviews")
);

if (!hasReviewsTab) return { error: "Reviews tab is not available" };

const addressButton = document.querySelector("button[data-item-id='address']");
const address = addressButton?.getAttribute("aria-label") || "";

const reviewsButton = document.querySelector(
  "button[jsaction*='reviewChart.moreReviews']"
);
const reviews = reviewsButton
  ? parseInt(
      reviewsButton.innerText.replace(/[^\d,]/g, "").replace(/,/g, ""),
      10
    )
  : 0;

const ratingElement = document.querySelector(".fontDisplayLarge");
const rating = ratingElement ? parseFloat(ratingElement.innerText) : 0;

return { address, reviews, rating };
