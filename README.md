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

- `index.html`: café copy, menu items/prices, opening hours, address and contact information.
- `src/styles.css`: colours, typography, layout, mobile and print styles.
- `src/main.js`: navigation, menu filters and subtle reveals.
- `assets/`: original SVG illustration placeholders and the self-hosted Manrope font.
- `DESIGN.md`: the information architecture, design system and component plan.

## Included behaviour

- Menu category filters with accessible pressed states and live announcements.
- Printable full menu, including categories currently filtered out on screen.
- Mobile navigation with Escape dismissal and no hidden focusable links.
- Reduced-motion support, keyboard focus indicators, semantic sections and a skip link.
- Local assets only; no trackers, cookies, third-party runtime requests or external fonts.
- Complete readable menu and navigation when JavaScript is disabled.

## Replace the three illustrations

Supply these photos, ideally without baked-in text or watermarks:

1. **Hero coffee:** portrait, 1600 × 2000 or larger. A latte/cappuccino on a warm café table, cup near the centre. Leave space around it for the arched crop. Current placeholder: `assets/coffee-hero.svg`.
2. **Café interior:** landscape, 1800 × 1200 or larger. A naturally lit seating area with a table/window; avoid identifiable customers unless you have their permission. Current placeholder: `assets/cafe-interior.svg`. The design crops this to a nearly square area, so keep the important subject central.
3. **Pastry:** landscape, 1600 × 1200 or larger. A croissant, cookie or other signature bake, preferably on a table beside a cup. Current placeholder: `assets/croissant.svg`.

Use owned or appropriately licensed photos. When supplied, create efficient WebP/AVIF sizes, update the `img` sources, dimensions and alt text, and remove the photography-to-follow caption. The current SVG illustrations are original editable placeholders.

## Before any real client launch

This is a clearly labelled fictional café concept. All prices and hours are samples. Address and phone/email are deliberately unconfigured; there is no ordering, reservation or contact backend. Do not claim that enquiries or payments are functional.

For a real launch, replace the sample content with approved information, configure a genuine contact/directions action, and remove the demo notice and `noindex`/robots block only when appropriate. This phase includes no analytics dashboard or tracking; those can be connected after deployment using the client's account.

The generated `dist/` can be hosted by a static hosting provider. Hosting and connecting the purchased domain will be a separate guided step. This folder is independent of the ATRIXX WEB portfolio in `../forme-studio`.

## Asset licence

The local Manrope font is distributed under the SIL Open Font License; its licence is retained at `assets/fonts/OFL.txt`.
