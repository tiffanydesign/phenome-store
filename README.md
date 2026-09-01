# Phenome Store — site mirror

A complete, verified mirror of the Phenome store website, captured from the
source deployment for hosting on GitHub Pages.

**Live:** https://tiffanydesign.github.io/phenome-store/

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
  `/shared.css`, `/assets/…`) are prefixed with `/phenome-store` so the
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

## Design tokens — Digital Twin

`phenome-glass.css` re-points the mirror's own token layer at the design system
in [phenome-digital-twin](https://tiffanydesign.github.io/phenome-digital-twin/digitaltwin.html).
It is an overlay: `shared.css` is unchanged and still byte-accurate to the
capture, and every page loads the Adobe kit, then `shared.css`, then this file.

| | |
|---|---|
| Type | `helvetica-neue-lt-pro` for everything; `new-science-mono` for prices and readings. The store's type ladder is kept and re-tracked for Helvetica. |
| Colour | The brand ramp (`#0a1e57`→`#e6e9f2`), the navy ink scale and the twin's status ramp, mapped onto the existing `--ph-*` names. The accent moves from the measured web blue `#0071E3` to Phenome Blue `#203a85`, which settles Appendix B #1 in `shared.css`. Black grounds become `#0a1e57`. |
| Glass | The twin's fourth "plain frosted" doctrine: one flat white fill, `blur(24px) saturate(140%)`, one long soft drop. No rim, no grain, no sheen, no inner glow. |
| Ground | The twin's field on `<body>` — a 150° three-stop wash, two brand pools and two corner lobes — because a rimless pane needs structure behind it. |

Contralto and the serif type scale are **not** carried over; the store keeps a
single sans.

Two known trades, both written up at their own rules in `phenome-glass.css`:
the mega-menu takes an 84% fill rather than the doctrine's 59% because it opens
over arbitrary page content, and `.tile` keeps its warm `#E3E3E3` plate because
that value is measured off the kit photographs and any other ground puts a seam
across the tile.

### The design system page

`/design-system/` documents the system in the system: it loads `shared.css` and
`phenome-glass.css` and reads its own tokens, so nothing on it can drift from
what ships. Eight sections — typeface, type scale, colour, the ground, glass
surfaces, elevation & motion, components, inverted contexts — with a live
backdrop switcher on the glass section that puts the five tiers over the field,
over a photograph and over the navy, which is the only way to show why the tiers
exist rather than assert it.

Every one of the 82 store pages carries a `.ds-launch` control bottom right —
a glass disc that opens to a pill and links here. It takes the overlay tier
rather than the live tier: it is fixed to the window and travels over film,
photography and navy without knowing which, so it has no context to flip its ink
against. The design system page itself does not carry one.

### One rule: no serif

The system is sans-serif and there is no serif in it — not as a face, not as a
fallback. Both stacks end on a generic sans (`sans-serif` and `monospace`), and
New Science Mono is a fixed-pitch sans, in the system because a column of prices
has to line up on the decimal. A guard rule in `phenome-glass.css` names the
elements that do not inherit from `<body>` — form controls, `::placeholder` and
`<svg><text>`, the last because an SVG text node with no font-family falls back
to the platform UA face and lands on Times New Roman under Windows.
