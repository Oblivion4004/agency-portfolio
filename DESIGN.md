# Atharva Coffee — first design

## Purpose

A clearly labelled fictional neighbourhood café, built to practise a real client workflow. The first release helps a visitor explore the menu and find visit information. No orders, reservations, email delivery, or analytics collection are implied.

## Information architecture

1. Header: café identity, menu, story, visit.
2. Hero: a welcoming proposition and a direct menu link.
3. Coffee interlude: the galaxy-art hero cup spins 360° and hops along the scroll and settles in the centre before the menu; static illustrations for reduced motion or no JavaScript.
4. Menu: descriptions without prices, accessible category filters and a printable full menu.
5. Story: a woman and a man facing each other with laptops and coffee; an empty chair is part of the static illustration.
6. Bakery feature: an illustrated croissant with four clickable bites, live progress, a visit link after the final bite and replay.
7. Visit: clearly labelled sample hours and unconfigured address/contact details.
8. Footer: demo disclosure and studio credit.

## Visual system

- Cream #f5f0e6, espresso #30251f, deep olive #394334, clay #b85136.
- Editorial Georgia headings with local Manrope for body text and navigation.
- Broad margins, fine rules, large image areas and restrained corner rounding.
- Original SVG illustrations occupy the exact photo slots until supplied images replace them.
- Scroll animation uses document-relative transforms with a passive scroll listener and requestAnimationFrame. No scroll locking. Reduced motion replaces the travelling cup with static artwork.
- The croissant uses a native button for mouse, touch and keyboard input. SVG masks cut away actual pastry, live text announces each stage, and replay restores it. No JavaScript preserves the whole illustration.

## Components and implementation

- Semantic single-page HTML with a skip link and clear heading hierarchy.
- Accessible mobile navigation, category filter buttons, live menu count and print action.
- Menu remains fully readable without JavaScript. Print includes every category.
- Native CSS and small JavaScript modules; no framework or external runtime is needed for this brochure site.
- Self-hosted font, local illustrations, no trackers, and no third-party requests.
- Static build in dist/ supports inexpensive static hosting. Domain connection is a later step.

## Photo handoff

- Hero: a portrait coffee close-up, ideally 1600 × 2000 or larger.
- Story: a landscape café interior with natural light, ideally 1800 × 1200 or larger.
- Bakery: a landscape pastry close-up, ideally 1600 × 1200 or larger.
- Use owned or licensed images. Alt text will be revised to match the supplied photographs.

## Verification

Run lint and build, then inspect desktop and mobile layout, menu filtering, keyboard navigation, reduced motion and print behaviour. Document remaining placeholder details before a real launch.
