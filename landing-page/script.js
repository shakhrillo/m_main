const scrollPricingContainer = document.getElementById("geo-pricing-carousel");
const scrollContainer = document.getElementById("geo-carousel");
function scrollPricingContent(distance) {
  scrollPricingContainer.scrollLeft += distance;
}
function scrollContent(distance) {
  scrollContainer.scrollLeft += distance;
}
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const logo = document.getElementById("logo");

  const hadSerClassInitially = navbar.classList.contains("ser");

  function updateLogo() {
    logo.src = navbar.classList.contains("ser")
      ? "./icons/logo-wing-white.svg"
      : "./icons/logo-wing.svg";
  }

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled", "bg-white");
      navbar.classList.remove("bg-transparent", "ser");
    } else {
      navbar.classList.remove("scrolled", "bg-white");
      navbar.classList.add("bg-transparent");

      if (hadSerClassInitially) {
        navbar.classList.add("ser");
      }
    }
    updateLogo();
  }

  updateLogo();
  window.addEventListener("scroll", handleScroll);

  const observer = new MutationObserver(updateLogo);
  observer.observe(navbar, { attributes: true, attributeFilter: ["class"] });
});
