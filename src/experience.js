const journey = document.querySelector(".coffee-journey");
const photo = document.querySelector(".hero-photo");
const destination = document.querySelector(".cup-destination");
const cup = document.querySelector(".travel-cup");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let geometry;
let frame = 0;
const clamp = (value) => Math.max(0, Math.min(1, value));

function measure() {
  const origin = journey.getBoundingClientRect();
  const picture = photo.getBoundingClientRect();
  const target = destination.getBoundingClientRect();
  // Match the SVG's object-fit: cover geometry, including its mobile crop.
  const ratio = Math.max(picture.width / 1000, picture.height / 1200);
  const width = 700 * ratio;
  const height = 690 * ratio;
  const x =
    picture.left -
    origin.left +
    (picture.width - 1000 * ratio) / 2 +
    170 * ratio;
  const y =
    picture.top -
    origin.top +
    (picture.height - 1200 * ratio) / 2 +
    360 * ratio;
  const targetX = target.left - origin.left;
  const targetY = target.top - origin.top;
  geometry = {
    x,
    y,
    width,
    height,
    dx: targetX + target.width / 2 - (x + width / 2),
    dy: targetY + target.height / 2 - (y + height / 2),
    scale: target.width / width,
    start:
      picture.top + window.scrollY + picture.height * 0.6 - innerHeight * 0.55,
    end: target.top + window.scrollY + target.height / 2 - innerHeight * 0.5,
  };
  cup.style.width = `${width}px`;
  cup.style.height = `${height}px`;
  render();
}

function render() {
  frame = 0;
  if (!geometry || reduceMotion.matches) return;
  const g = geometry;
  const progress = clamp(
    (window.scrollY - g.start) / Math.max(1, g.end - g.start),
  );
  const eased = progress * progress * (3 - 2 * progress);
  const hop =
    Math.abs(Math.sin(progress * Math.PI * 2)) *
    (innerWidth < 761 ? 38 : 80) *
    (1 - progress * 0.4);
  const tilt = Math.sin(progress * Math.PI * 2) * 15;
  const scale = 1 + (g.scale - 1) * eased;
  cup.style.transform = `translate3d(${g.x + g.dx * eased}px, ${g.y + g.dy * eased - hop}px, 0) rotate(${tilt}deg) scale(${scale})`;
}

function onScroll() {
  if (!frame && !reduceMotion.matches) frame = requestAnimationFrame(render);
}

function configureMotion() {
  journey.classList.toggle("coffee-motion", !reduceMotion.matches);
  if (reduceMotion.matches) {
    cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("scroll", onScroll);
  } else {
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
}

configureMotion();
reduceMotion.addEventListener("change", configureMotion);
window.addEventListener("resize", measure);
window.addEventListener("pageshow", measure);
document.fonts.ready.then(measure);
// Layout can change when the mobile navigation or text dimensions change.
if ("ResizeObserver" in window) new ResizeObserver(measure).observe(journey);

const scene = document.querySelector(".cafe-scene");
const chairButton = document.querySelector(".chair-button");
const chairHint = document.querySelector(".chair-hint");
let selected = false;
let hovered = false;
let focused = false;
chairButton.hidden = false;
function updateChair() {
  scene.classList.toggle("is-inviting", selected || hovered || focused);
  chairButton.setAttribute("aria-pressed", String(selected));
  chairHint.textContent = selected
    ? "Your chair is ready. Stay a little."
    : "Hover, focus, or tap to make yourself at home.";
}
scene.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") {
    hovered = true;
    updateChair();
  }
});
scene.addEventListener("pointerleave", () => {
  hovered = false;
  updateChair();
});
chairButton.addEventListener("focus", () => {
  focused = true;
  updateChair();
});
chairButton.addEventListener("blur", () => {
  focused = false;
  updateChair();
});
chairButton.addEventListener("click", () => {
  selected = !selected;
  focused = false;
  updateChair();
});
chairButton.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    selected = false;
    hovered = false;
    focused = false;
    updateChair();
  }
});
updateChair();
