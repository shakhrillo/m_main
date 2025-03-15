/**
 * Retrieves the address, reviews count, and rating from a page.
 *
 * @returns {Object} The address, reviews count, and rating or an error.
 */

// Check if the reviews tab is available
const tabs = [...document.querySelectorAll('button[role="tab"]')];
const hasReviewsTab = tabs.some((tab) =>
  tab.innerText.toLowerCase().includes("reviews")
);

if (!hasReviewsTab) return { error: "Reviews tab is not available" };

// Clean the text by removing non-ASCII characters
const cleanText = (text) => text.replace(/[^\x20-\x7E]+/g, '').trim();

// Get the address, reviews count, and rating
const addressButton = document.querySelector("button[data-item-id='address']");
const address = cleanText(addressButton?.getAttribute("aria-label") || "").replace(
  "Address: ",
  ""
);

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

const authority = document.querySelector('a[data-item-id="authority"]');
const authorityText = authority?.innerText || "";
const authorityHref = authority?.href || "";
const authorityLink = authorityText ? { 
  text: cleanText(authorityText),
  href: authorityHref
} : null;

const menu = document.querySelector('a[data-item-id="menu"]');
const menuText = menu?.innerText || "";
const menuHref = menu?.href || "";
const menuLink = menuText ? {
  text: cleanText(menuText),
  href: menuHref
} : null;

const oloc = document.querySelector('button[data-item-id="oloc"]');
const olocText = oloc?.innerText || "";
const olocLink = olocText ? {
  text: cleanText(olocText)
} : null;

const region = document.querySelector('button[jsaction*="pane.attributes.expand"]');
const regionText = region?.innerText || "";
const regionLink = regionText ? {
  text: cleanText(regionText)
} : null;

const h1 = document.querySelector('h1');
const title = cleanText(h1?.innerText) || "";

const h2 = document.querySelector('h2');
const subtitle = cleanText(h2?.innerText) || "";

const currentUrl = window.location.href;

// Match the first set of coordinates after '@'
const atMatch = currentUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
const lat1 = atMatch ? atMatch[1] : null;
const lng1 = atMatch ? atMatch[2] : null;

// Match the second set of coordinates after '3d' and '4d'
const secondMatch = currentUrl.match(/3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
const lat2 = secondMatch ? secondMatch[1] : null;
const lng2 = secondMatch ? secondMatch[2] : null;

// Set the location based on the coordinates
const coordinates = {
  lat: parseFloat(lat2 || lat1),
  lng: parseFloat(lng2 || lng1)
};

// button[data-value="Share"]
const shareButton = document.querySelector('button[data-value="Share"]');
if (shareButton) {
  shareButton.click();
}

// wait 2 seconds
await new Promise((resolve) => setTimeout(resolve, 2000));

// input[jsaction="pane.wfvdle358.clickInput"]
const copyInput = document.querySelector('input[jsaction*="clickInput"]');
const shareLink = copyInput?.value || "";

return { address, reviews, rating, authorityLink, menuLink, olocLink, regionLink, title, subtitle, currentUrl, coordinates, shareLink };
