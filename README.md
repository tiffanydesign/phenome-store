# Phenome Store — site mirror

A complete, verified mirror of the Phenome store website, captured from the
source deployment for hosting on GitHub Pages.

**Live:** https://tiffanydesign.github.io/phenome-store-mirror/

## What was captured

| | |
|---|---|
| HTML pages | 82 |
| Images (webp/svg) | 205 |
| Video (mp4/webm) | 14 |
| Stylesheets | `shared.css`, `assets/fonts/outfit.css` |
| Scripts | `shared.js` (builds the nav and footer at runtime) |
| Fonts | 2 woff2 |
| **Total files** | **307** |

Every one of the 306 internal references was resolved and checked; there are
no broken links, missing images or missing media.

## Branches

- **`main`** — what GitHub Pages serves. Identical to the source in content and
  markup, with one mechanical change: root-absolute paths (`/store/`,
  `/shared.css`, `/assets/…`) are prefixed with `/phenome-store-mirror` so the
  site works from a project-pages subpath. 1,104 references were rewritten.
- **`original`** — the untouched capture, byte-for-byte identical to the source
  deployment. Use this branch if you move the site to a domain root.

`.gitattributes` disables git line-ending translation so both branches stay
byte-accurate on checkout. `.nojekyll` stops GitHub Pages from running the
files through Jekyll.

## Site structure

```
/                    home              /store/          storefront + 15 pages
/testing/            11 pages          /supplements/    22 product pages
/science/            5 pages           /devices/ring/   5 pages
/app/                5 pages           /hub/            4 pages
/clinic/  /account/  3 pages each      /legal/          privacy, terms
/about/  /careers/  /press/  /contact/  /quiz/  /sitemap/
```
