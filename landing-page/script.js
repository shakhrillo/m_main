const scrollPricingContainer = document.getElementById("geo-pricing-carousel");
const scrollContainer = document.getElementById("geo-carousel");
function scrollPricingContent(distance) {
  scrollPricingContainer.scrollLeft += distance; // Scrolls by the specified distance
}
function scrollContent(distance) {
  scrollContainer.scrollLeft += distance; // Scrolls by the specified distance
}
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const logo = document.getElementById("logo");

  // Проверяем, был ли класс "ser" при загрузке
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

      // Если класс "ser" был изначально, возвращаем его
      if (hadSerClassInitially) {
        navbar.classList.add("ser");
      }
    }
    updateLogo();
  }

  updateLogo();
  window.addEventListener("scroll", handleScroll);

  // Observe class changes to update the logo
  const observer = new MutationObserver(updateLogo);
  observer.observe(navbar, { attributes: true, attributeFilter: ["class"] });
});
