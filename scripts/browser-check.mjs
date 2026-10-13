import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root = fileURLToPath(new URL("../", import.meta.url));
await mkdir(new URL("../artifacts/", import.meta.url), { recursive: true });
const server = spawn(process.execPath, ["scripts/serve.mjs", "--dist"], {
  cwd: root,
  env: { ...process.env, PORT: "0" },
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Preview server did not start")),
      10000,
    );
    server.stdout.on("data", (chunk) => {
      const match = String(chunk).match(/Local: (http:\/\/localhost:\d+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    server.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Preview exited: ${code}`));
    });
  });
  browser = await chromium.launch({
    headless: true,
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
  });
  const errors = [];
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await desktopContext.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  assert.equal((await page.goto(url)).status(), 200);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator(".menu-price").count(), 0);
  assert.equal((await page.locator("#menu").innerText()).includes("₹"), false);
  const cupAtStart = await page.locator(".travel-cup").getAttribute("style");
  await page.locator(".cup-destination").scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const target = document
      .querySelector(".cup-destination")
      .getBoundingClientRect();
    window.scrollTo({
      top: scrollY + target.top + target.height / 2 - innerHeight / 2 + 10,
      behavior: "instant",
    });
  });
  await page.waitForTimeout(100);
  assert.notEqual(
    await page.locator(".travel-cup").getAttribute("style"),
    cupAtStart,
    "Cup should move on scroll",
  );
  const landed = await page.evaluate(() => {
    const cup = document.querySelector(".travel-cup").getBoundingClientRect();
    const target = document
      .querySelector(".cup-destination")
      .getBoundingClientRect();
    return (
      Math.abs(cup.left - target.left) < 2 && Math.abs(cup.top - target.top) < 2
    );
  });
  assert.equal(landed, true, "Cup should land in its centred destination");
  await page.screenshot({ path: `${root}/artifacts/coffee-landing.png` });
  assert.match(
    await page.locator(".travel-cup").getAttribute("style"),
    /rotate\(360deg\)/,
  );
  assert.equal(await page.locator(".chair-button").count(), 0);
  await page.locator(".cafe-scene").hover();
  assert.equal(
    await page
      .locator("#guest-chair")
      .evaluate((el) => getComputedStyle(el).transform),
    "none",
  );
  await page
    .locator(".cafe-scene")
    .screenshot({ path: root + "/artifacts/cafe-scene.png" });
  const bite = page.locator(".bite-trigger");
  for (let count = 1; count <= 4; count++) {
    await bite.click();
    assert.equal(
      await page.locator(".croissant-game").getAttribute("data-bites"),
      String(count),
    );
    if (count === 2 || count === 4)
      await page
        .locator(".croissant-game")
        .screenshot({ path: root + "/artifacts/croissant-" + count + ".png" });
  }
  assert.equal(await page.locator(".bite-finish").isVisible(), true);
  assert.equal(
    await page.locator(".bite-finish a").getAttribute("href"),
    "#visit",
  );
  await bite.click({ force: true });
  assert.equal(
    await page.locator(".croissant-game").getAttribute("data-bites"),
    "4",
  );
  await page.locator(".bite-reset").click();
  assert.equal(
    await bite.evaluate((el) => document.activeElement === el),
    true,
  );
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  assert.equal(
    await page.locator(".croissant-game").getAttribute("data-bites"),
    "2",
  );
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  assert.deepEqual(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
    [],
    "Finished game accessibility",
  );
  await page.locator(".bite-reset").click();
  assert.equal(await page.locator(".menu-item:visible").count(), 8);
  await page.getByRole("button", { name: "Coffee", exact: true }).click();
  assert.equal(await page.locator(".menu-item:visible").count(), 3);
  await page.getByRole("button", { name: "Cold sips", exact: true }).click();
  assert.equal(await page.locator(".menu-item:visible").count(), 2);
  await page
    .getByRole("button", { name: "From the oven", exact: true })
    .click();
  assert.equal(await page.locator(".menu-item:visible").count(), 3);
  await page.emulateMedia({ media: "print" });
  assert.equal(
    await page.locator(".menu-item:visible").count(),
    8,
    "Print must include every menu category",
  );
  await page.emulateMedia({ media: "screen" });
  await page
    .getByRole("button", { name: "A little of everything", exact: true })
    .click();
  assert.equal(await page.locator(".menu-item:visible").count(), 8);
  for (const element of await page.locator(".reveal").all())
    await element.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(800);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "Desktop horizontal overflow",
  );
  assert.equal(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every((img) => img.complete && img.naturalWidth > 0),
      ),
    true,
  );
  await page.screenshot({
    path: `${root}/artifacts/desktop-preview.png`,
    fullPage: true,
  });
  await page.screenshot({ path: `${root}/artifacts/desktop-hero.png` });
  assert.deepEqual(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
    [],
    "Desktop accessibility violations",
  );

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const mobile = await mobileContext.newPage();
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(url);
  await mobile.evaluate(() => document.fonts.ready);
  assert.equal(
    await mobile.locator(".travel-cup").isVisible(),
    false,
    "Reduced motion uses a static cup",
  );
  for (let count = 1; count <= 4; count++) {
    await mobile.locator(".bite-trigger").tap();
    assert.equal(
      await mobile.locator(".croissant-game").getAttribute("data-bites"),
      String(count),
    );
  }
  assert.equal(await mobile.locator(".bite-finish").isVisible(), true);
  await mobile
    .locator(".croissant-game")
    .screenshot({ path: root + "/artifacts/mobile-croissant.png" });
  await mobile.locator(".bite-reset").tap();
  assert.equal(
    await mobile.locator(".croissant-game").getAttribute("data-bites"),
    "0",
  );
  await mobile.evaluate(() => window.scrollTo(0, 0));
  assert.equal(
    await mobile.locator("#site-nav").evaluate((nav) => nav.inert),
    true,
  );
  await mobile.getByRole("button", { name: "Menu", exact: true }).click();
  assert.equal(
    await mobile.locator(".nav-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await mobile
    .getByRole("navigation")
    .getByRole("link", { name: "Our menu", exact: true })
    .click();
  assert.equal(
    await mobile.locator(".nav-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await mobile.getByRole("button", { name: "Menu", exact: true }).click();
  await mobile.keyboard.press("Escape");
  assert.equal(
    await mobile.locator(".nav-toggle").getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(
    await mobile
      .locator(".nav-toggle")
      .evaluate((button) => document.activeElement === button),
    true,
  );
  await mobile.getByRole("link", { name: "Explore the bakes" }).click();
  assert.equal(await mobile.locator(".menu-item:visible").count(), 3);
  await mobile
    .getByRole("button", { name: "A little of everything", exact: true })
    .click();
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "Mobile horizontal overflow",
  );
  for (const image of await mobile.locator("img:visible").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.decode());
  }
  assert.deepEqual(
    (
      await new AxeBuilder({ page: mobile })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
    [],
    "Mobile accessibility violations",
  );
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await mobile.screenshot({
    path: `${root}/artifacts/mobile-preview.png`,
    fullPage: true,
  });
  await mobile.setViewportSize({ width: 320, height: 740 });
  assert.equal(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "Small phone horizontal overflow",
  );

  const mobileMotion = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobileMotion.goto(url);
  await mobileMotion.evaluate(() => document.fonts.ready);
  await mobileMotion.evaluate(() => {
    const target = document
      .querySelector(".cup-destination")
      .getBoundingClientRect();
    window.scrollTo({
      top: scrollY + target.top + target.height / 2 - innerHeight / 2 + 20,
      behavior: "instant",
    });
  });
  await mobileMotion.waitForTimeout(100);
  assert.equal(
    await mobileMotion.evaluate(() => {
      const cup = document.querySelector(".travel-cup").getBoundingClientRect();
      const target = document
        .querySelector(".cup-destination")
        .getBoundingClientRect();
      return (
        Math.abs(cup.left - target.left) < 2 &&
        Math.abs(cup.top - target.top) < 2
      );
    }),
    true,
    "Mobile cup reaches its destination",
  );
  await mobileMotion.screenshot({
    path: `${root}/artifacts/mobile-coffee-landing.png`,
  });
  await mobileMotion.emulateMedia({ reducedMotion: "reduce" });
  await mobileMotion.waitForTimeout(100);
  assert.equal(
    await mobileMotion.locator(".travel-cup").isVisible(),
    false,
    "Motion preferences can change while browsing",
  );
  const noJavaScript = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  await noJavaScript.goto(url);
  assert.equal(await noJavaScript.locator(".menu-item:visible").count(), 8);
  assert.equal(
    await noJavaScript.getByRole("navigation").getByRole("link").count(),
    3,
  );
  assert.equal(await noJavaScript.locator(".menu-filters").isVisible(), false);
  assert.equal(await noJavaScript.locator(".croissant-art").isVisible(), true);
  assert.equal(await noJavaScript.locator(".bite-trigger").isVisible(), false);
  assert.equal((await page.request.get(`${url}/missing-page`)).status(), 404);
  assert.equal((await page.request.get(`${url}/package.json`)).status(), 404);
  assert.deepEqual(errors, [], "Browser errors or failed resources");
  console.log(
    "PASS: desktop/mobile layouts and accessibility scans, menu filters, print, navigation/Escape, reduced motion, no-JS fallback, local assets and 404s. Screenshots saved in artifacts/.",
  );
} finally {
  await browser?.close();
  server.kill();
}
