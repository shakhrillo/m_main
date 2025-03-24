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
    navbar.classList.add("scrolled", "bg-white");
    navbar.classList.remove("bg-transparent", "ser");
  } else {
    navbar.classList.remove("scrolled", "bg-white");
    navbar.classList.add("bg-transparent", "ser");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const logo = document.getElementById("logo");

  function updateLogo() {
    if (!navbar.classList.contains("ser")) {
      navbar.classList.add("ser");
    }
    logo.src = navbar.classList.contains("ser")
      ? "./icons/logo-wing-white.svg"
      : "./icons/logo-wing.svg";
  }

  updateLogo();

  // Observe class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        if (!navbar.classList.contains("ser")) {
          navbar.classList.add("ser");
        }
        updateLogo();
      }
    });
  });

  observer.observe(navbar, { attributes: true, attributeFilter: ["class"] });
});
