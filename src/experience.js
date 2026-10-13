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
  const tilt = 360 * eased;
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

const game = document.querySelector(".croissant-game");
const biteButton = game.querySelector(".bite-trigger");
const status = game.querySelector("#bite-status");
const cutout = game.querySelector("#bite-cutout");
const finish = game.querySelector(".bite-finish");
const invitation = game.querySelector(".bite-invitation");
let bites = 0;
const messages = [
  "Flaky. Buttery. All yours.",
  "That first, buttery bite. Keep going.",
  "Halfway to happiness.",
  "One last bite. Make it count.",
  "Just crumbs. That went well.",
];
const labels = [
  "Take the first bite of the croissant",
  "Take a second bite: eat half the croissant",
  "Take a third bite of the croissant",
  "Take the final bite of the croissant",
  "Croissant finished. Find café details below.",
];
// Each scalloped edge cuts further across the actual pastry, leaving the table intact.
const cuts = [
  "",
  "M825 0H1200V850H825V575q-55-20-12-63q-63-20-20-65q-65-22-18-68q-58-32-4-65V0Z",
  "M630 0H1200V850H630V580q-60-20-20-64q-62-24-16-70q-59-26-12-70q-50-35-2-75V0Z",
  "M430 0H1200V850H430V620q-58-20-12-63q-58-25-13-68q-54-29-11-67q-50-32-3-74V0Z",
  "M0 0h1200v850H0z",
];
function updateBites() {
  game.dataset.bites = String(bites);
  cutout.setAttribute("d", cuts[bites]);
  game.querySelector("#croissant-title").textContent = [
    "A whole golden croissant on baking paper",
    "A croissant with its first bite missing",
    "Half a golden croissant",
    "The last small piece of croissant",
    "An empty sheet of baking paper with croissant crumbs",
  ][bites];
  status.textContent = messages[bites];
  game.querySelector(".bite-count").textContent = bites + " / 4 BITES";
  biteButton.setAttribute("aria-label", labels[bites]);
  biteButton.setAttribute("aria-disabled", String(bites === 4));
  finish.hidden = bites !== 4;
  invitation.hidden = bites !== 0;
}
biteButton.hidden = false;
game.querySelector(".bite-controls").hidden = false;
biteButton.addEventListener("click", () => {
  if (bites === 4) return;
  bites += 1;
  updateBites();
});
game.querySelector(".bite-reset").addEventListener("click", () => {
  bites = 0;
  updateBites();
  biteButton.focus({ preventScroll: true });
});
updateBites();
