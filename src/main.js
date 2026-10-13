const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const mobileQuery = window.matchMedia("(max-width: 760px)");

function setNavOpen(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector(".nav-toggle-label").textContent = open
    ? "Close"
    : "Menu";
  nav.classList.toggle("is-open", open);
  nav.inert = mobileQuery.matches && !open;
}

toggle.hidden = false;
document.documentElement.classList.add("js");
setNavOpen(false);
toggle.addEventListener("click", () =>
  setNavOpen(toggle.getAttribute("aria-expanded") !== "true"),
);
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle.getAttribute("aria-expanded") === "true"
  ) {
    setNavOpen(false);
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !toggle.contains(event.target))
    setNavOpen(false);
});
mobileQuery.addEventListener("change", () => setNavOpen(false));

const filters = [...document.querySelectorAll("[data-filter]")];
const menuItems = [...document.querySelectorAll("[data-category]")];
const menuStatus = document.querySelector("#menu-status");
document.querySelector(".menu-filters").hidden = false;

function filterMenu(category) {
  filters.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === category),
    ),
  );
  menuItems.forEach((item) => {
    item.hidden = category !== "all" && item.dataset.category !== category;
  });
  const visibleCount = menuItems.filter((item) => !item.hidden).length;
  const categoryLabel = filters.find(
    (button) => button.dataset.filter === category,
  ).textContent;
  menuStatus.textContent = `${visibleCount} menu items shown. ${categoryLabel}.`;
}

filters.forEach((button) =>
  button.addEventListener("click", () => filterMenu(button.dataset.filter)),
);
document
  .querySelector(".menu-bakes-link")
  .addEventListener("click", () => filterMenu("bakes"));
const printButton = document.querySelector("#print-menu");
printButton.hidden = false;
printButton.addEventListener("click", () => window.print());
document.querySelector("#year").textContent = String(new Date().getFullYear());

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06 },
  );
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("will-reveal");
    observer.observe(element);
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      document
        .querySelectorAll(".will-reveal")
        .forEach((element) => element.classList.add("is-visible"));
      observer.disconnect();
    }
  });
}
