const scrollPricingContainer = document.getElementById("geo-pricing-carousel");
const scrollContainer = document.getElementById("geo-carousel");
function scrollPricingContent(distance) {
  scrollPricingContainer.scrollLeft += distance; // Scrolls by the specified distance
}
function scrollContent(distance) {
  scrollContainer.scrollLeft += distance; // Scrolls by the specified distance
}

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    console.log("Sdasd");
    navbar.classList.remove("scrolled");
  }
});
