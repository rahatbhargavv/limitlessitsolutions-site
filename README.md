# Limitless IT Solutions website

Static site, no dependencies. Source lives in `site.config.mjs`, `content.mjs`, `build.mjs` and `src/assets/`. `node build.mjs` writes the finished site to `dist/`.

## Edit text
- Business details (phone, hours, warranty, booking link, GA4 ID, form key, reviews, about text): **`site.config.mjs`**.
- Service page and blog text: **`content.mjs`**.
- Page layouts (home, contact, legal, etc.): **`build.mjs`**.
- Look and feel: `src/assets/style.css`.

After any edit: `node build.mjs`, open `dist/index.html` to check, then commit and push. The host rebuilds automatically.

## Add reviews (only real ones)
In `site.config.mjs`: `reviews: [{ quote: "Exact words the customer wrote", name: "First L." }]`. The reviews section appears only when this list is not empty. Get permission from the customer first.

## Add photos
Put images in `src/assets/`, then reference them in `build.mjs` with descriptive `alt` text. Use your own photos only.

## Publish the Cabling page
It is built at `/cabling/` with noindex and no links. Only after licensing is confirmed in writing: in `content.mjs` remove `hidden:true` on the cabling entry, fix the licensing FAQ answer, and rebuild.

## Placeholders
Anything in a yellow `[BRACKET]` box on the site is missing information. See `NEEDS_FROM_OWNER.md`.
