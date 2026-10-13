# Atharva Coffee

A separate, fictional café demo for learning the client website workflow. Intended domain: **atharvacoffee.store**. No domain or hosting settings have been changed.

## Run locally

Use a current Node.js LTS release (Node 24 was used for verification).

```sh
npm ci
npm run dev
```

Open the URL printed by the server, normally http://localhost:4173. The page is plain HTML, CSS and JavaScript, with no production dependencies. Saving a source file requires a browser refresh.

## Check and build

```sh
npm run lint
npm run build
npm test
```

The build copies deployable files into `dist/` and checks local asset references. `npm run preview` serves that output. Browser tests launch a temporary local server, use installed Microsoft Edge on Windows, and close their server/browser when finished. On another OS, run `npx playwright install chromium` once; `BROWSER_CHANNEL` can select an installed supported browser. Tests cover desktop and phone layouts, category filters, print, navigation, reduced motion, JavaScript-disabled rendering, resources, 404s, and automated WCAG accessibility scans. Screenshots go in ignored `artifacts/`. Automated scans do not replace real-device testing.

## Files to edit

- `index.html`: café copy, menu descriptions, inline café scene, opening hours, address and contact information.
- `src/styles.css`: colours, typography, layout, mobile and print styles.
- `src/main.js`: navigation, menu filters and subtle reveals.
- `src/experience.js` and `src/experience.css`: scroll-driven cup choreography and the four-bite croissant game.
- `assets/`: original SVG illustration placeholders and the self-hosted Manrope font.
- `DESIGN.md`: the information architecture, design system and component plan.

## Included behaviour

- A coffee cup transitions from leaf latte art to a galaxy while making a full 360° turn and hops from the hero to a centred interlude as the page scrolls. Scrolling remains native; reduced motion and disabled JavaScript use static illustrations.
- Two illustrated guests with laptops and coffee face one another in a static café scene.
- A croissant game supports four bites with mouse, touch, Enter or Space. Bite masks progressively remove the pastry; the final state links to café visit details and offers replay. Reduced motion keeps the game functional without hover movement, and no JavaScript shows the complete illustration.
- A price-free sample menu, including its printed version.
- Menu category filters with accessible pressed states and live announcements.
- Printable full menu, including categories currently filtered out on screen.
- Mobile navigation with Escape dismissal and no hidden focusable links.
- Reduced-motion support, keyboard focus indicators, semantic sections and a skip link.
- Local assets only; no trackers, cookies, third-party runtime requests or external fonts.
- Complete readable menu and navigation when JavaScript is disabled.

## Illustration assets and future photography

The hero uses `coffee-hero.svg` for its static fallback. The moving version separates `coffee-table.svg`, `coffee-cup-leaf.svg` and `coffee-cup.svg`. The matching leaf and galaxy cups blend between 15% and 85% of the scroll journey, reversing when scrolling back; static fallbacks show a leaf in the hero and a galaxy at the destination; changing the SVG view boxes requires updating the placement geometry in `src/experience.js`.

The static café scene and interactive croissant artwork are inline in `index.html`. The croissant uses an SVG mask controlled by the game; `assets/croissant.svg` remains the original illustration reference. `assets/cafe-scene.svg` is the original editable illustration reference; updating that reference alone does not update the inline scene.

For a later photography refresh, supply owned or licensed photos without baked-in text or watermarks:

1. **Hero coffee:** portrait, 1600 × 2000 or larger. A latte/cappuccino on a warm café table, cup near the centre. Leave space around it for the arched crop. Current placeholder: `assets/coffee-hero.svg`.
2. **Café interior:** landscape, 1800 × 1200 or larger, for an additional photo section. The current scene is a static original illustration.
3. **Pastry:** landscape, 1600 × 1200 or larger. A croissant, cookie or other signature bake, preferably on a table beside a cup. Current artwork: inline SVG in `index.html`; a photo replacement would also require redesigning the bite masks.

When supplied, create efficient WebP/AVIF sizes and update sources, dimensions and alt text. The current SVG illustrations are original editable artwork.

## Before any real client launch

This is a clearly labelled fictional café concept. Menu descriptions and hours are samples. Address and phone/email are deliberately unconfigured; there is no ordering, reservation or contact backend. Do not claim that enquiries or payments are functional.

For a real launch, replace the sample content with approved information, configure a genuine contact/directions action, and remove the demo notice and `noindex`/robots block only when appropriate. This phase includes no analytics dashboard or tracking; those can be connected after deployment using the client's account.

The generated `dist/` can be hosted by a static hosting provider. Hosting and connecting the purchased domain will be a separate guided step. This folder is independent of the ATRIXX WEB portfolio in `../forme-studio`.

### Cloudflare Workers Builds

This project includes `wrangler.jsonc` for an asset-only Worker. Use `npm run build` as the build command; the Wrangler configuration sets `./dist` as the assets directory so source files, dependencies and test artifacts are not uploaded. Use `npx wrangler deploy` as the deploy command. Do not use `.` as the Workers assets directory.

## Asset licence

The local Manrope font is distributed under the SIL Open Font License; its licence is retained at `assets/fonts/OFL.txt`.
