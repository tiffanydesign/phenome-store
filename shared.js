/* Phenome — shared nav + footer injection */
(function () {
  /* The tab icon, declared once here for every page that loads this file.
     Without it the browser asks the domain root for /favicon.ico, which on
     project pages is the portfolio site's root and answers 404. */
  if (!document.querySelector('link[rel~="icon"]')) {
    var favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = '/phenome-store/assets/brand/favicon.png';
    document.head.appendChild(favicon);
  }

  /* === MENU DATA — edit here; build/build_menu.py no longer exists === */
  /* THE PANEL SHAPE IS APPLE'S (apple.com/se, measured 2026-09-22 at 1440),
     with one picture card kept at the right end by request.
       · column 1 (`lead: true`) — "Explore …": the section's own doors, set
         large (24/28 at 600, 38px pitch). A link marked `small` closes the
         column at the small size, the way Apple ends Mac with "Compare Mac
         models".
       · columns 2 and 3 — "Shop …" and "More from …": grey title, links at
         the small size. Never more than three columns.
       · `featured` — ONE square card, right aligned, caption and arrow under
         it. `name` is the caption AND the search row.
     Search (searchKit below) reads every column link and the card off this
     one table, so nothing is authored twice. */
  var PH_MENU = [
    {
      "key": "store",
      "trigger": "Store",
      "href": "/phenome-store/store/",
      "columns": [
        {
          "title": "Explore store",
          "lead": true,
          "links": [
            { "label": "Shop all", "href": "/phenome-store/store/" },
            { "label": "Genetic tests", "href": "/phenome-store/testing/genetic/" },
            { "label": "Microbiome tests", "href": "/phenome-store/testing/microbiome/" },
            { "label": "Supplements", "href": "/phenome-store/store/supplements/" },
            { "label": "PhenomeTech Ring", "href": "/phenome-store/devices/ring/" },
            { "label": "PhenomeTech Band", "href": "/phenome-store/devices/band/" },
            { "label": "Shop by goal", "href": "/phenome-store/quiz/", "small": true }
          ]
        },
        {
          "title": "Quick links",
          "links": [
            { "label": "Track order", "href": "/phenome-store/account/orders/" },
            { "label": "Activate a kit", "href": "/phenome-store/account/activate/" },
            { "label": "Shipping and returns", "href": "/phenome-store/devices/ring/warranty-returns/" },
            { "label": "Contact us", "href": "/phenome-store/contact/" }
          ]
        }
      ],
      /* Store is the one panel with three cards, one per range: ring, test, supplement. */
      "featured": [
        { "name": "PhenomeTech Ring", "price": "from £179", "tag": "New",
          "href": "/phenome-store/store/phenometech-ring/",
          "img": "/phenome-store/assets/menu/tile-store-ring.webp" },
        { "name": "Comprehensive Genomic Test", "price": "£650", "tag": "Popular",
          "href": "/phenome-store/testing/comprehensive-genomic/",
          "img": "/phenome-store/assets/menu/tile-testing-genetic.webp" },
        { "name": "NAD+", "price": "", "tag": "Popular",
          "href": "/phenome-store/supplements/nad/",
          "img": "/phenome-store/assets/menu/tile-supp-nad.webp" }
      ]
    },
    {
      "key": "testing",
      "pin": true,
      "trigger": "Testing",
      "href": "",
      "columns": [
        {
          "title": "Explore testing",
          "lead": true,
          "links": [
            { "label": "Genetic testing", "href": "/phenome-store/testing/genetic/" },
            { "label": "Microbiome testing", "href": "/phenome-store/testing/microbiome/" }
          ]
        },
        {
          /* Shop testing: one column per sub category. The column TITLE is the
             link to that category in the Shop all catalogue; every product row goes
             to its buy page (genomic lives under /testing/, the rest under /store/). */
          "title": "Shop genetic testing",
          "href": "/phenome-store/store/#genetic-testing",
          "links": [
            { "label": "Comprehensive Genomic Test", "href": "/phenome-store/testing/comprehensive-genomic/" },
            { "label": "Carrier Screening Test", "href": "/phenome-store/store/carrier-screening/" },
            { "label": "Newborn Screening Test", "href": "/phenome-store/store/newborn-screening/", "note": "Sold out" },
            { "label": "Sports Performance Test", "href": "/phenome-store/store/sports-performance/" }
          ]
        },
        {
          "title": "Shop microbiome testing",
          "href": "/phenome-store/store/#microbiome-testing",
          "links": [
            { "label": "Gut Microbiome Test", "href": "/phenome-store/store/gut-microbiome/" },
            { "label": "Oral Microbiome Test", "href": "/phenome-store/store/oral-microbiome/" }
          ]
        },
        {
          "title": "Get tested",
          "links": [
            { "label": "How testing works", "href": "/phenome-store/testing/how-it-works/" },
            { "label": "Compare tests", "href": "/phenome-store/testing/compare/" },
            { "label": "Activate a kit", "href": "/phenome-store/account/activate/" },
            { "label": "Results and counselling", "href": "/phenome-store/app/results-and-reports/" },
            { "label": "Whole genome sequencing", "href": "/phenome-store/science/whole-genome-sequencing/" }
          ]
        }
      ],
      "featured": [
        { "name": "Comprehensive Genomic Test", "price": "£650", "tag": "Popular",
          "href": "/phenome-store/testing/comprehensive-genomic/",
          "img": "/phenome-store/assets/menu/tile-testing-genetic.webp" }
      ]
    },
    {
      "key": "supplements",
      "pin": true,
      "trigger": "Supplements",
      "href": "/phenome-store/store/supplements/",
      "columns": [
        {
          /* The title is the door to the supplements explore page; Shop all opens
             the Shop all catalogue at its first supplements category. */
          "title": "Explore supplements",
          "href": "/phenome-store/store/supplements/",
          "lead": true,
          "links": [
            { "label": "Shop all", "href": "/phenome-store/store/#energy-and-cognition" }
          ]
        },
        {
          /* Sub categories from the Phenome+ range by goal (2026-09-22), listing
             only products that have a page. Everyday Essentials has none yet, so
             it is not drawn. Four product columns side by side, and no picture
             card: the fourth column takes the card's place (user, 2026-09-22). */
          "title": "Energy & Cognition",
          "href": "/phenome-store/store/#energy-and-cognition",
          "links": [
            { "label": "NAD+ Boost", "href": "/phenome-store/supplements/nad-boost/" },
            { "label": "Gly-NAC", "href": "/phenome-store/supplements/gly-nac/" },
            { "label": "Carnitine Performance+", "href": "/phenome-store/supplements/carnitine-performance/" },
            { "label": "NAD+ (liposomal)", "href": "/phenome-store/supplements/nad/" }
          ]
        },
        {
          "title": "Immunity & Respiratory",
          "href": "/phenome-store/store/#immunity-and-respiratory",
          "links": [
            { "label": "Sambucus Gummies", "href": "/phenome-store/supplements/sambucus-gummies/" },
            { "label": "Throat Relief Lozenges", "href": "/phenome-store/supplements/throat-relief-lozenges/" },
            { "label": "Propolis Throat Lozenges", "href": "/phenome-store/supplements/propolis-throat-lozenges/" },
            { "label": "Pelargonium Throat Lozenges", "href": "/phenome-store/supplements/pelargonium-throat-lozenges/" },
            { "label": "Quercetin Capsules", "href": "/phenome-store/supplements/quercetin-capsules/" }
          ]
        },
        {
          "title": "Anti-Inflammatory",
          "href": "/phenome-store/store/#anti-inflammatory",
          "links": [
            { "label": "Joint Boost Capsules", "href": "/phenome-store/supplements/joint-boost-capsules/" },
            { "label": "FlexiCream", "href": "/phenome-store/supplements/flexicream/" },
            { "label": "Bromelain Capsules", "href": "/phenome-store/supplements/bromelain-capsules/" }
          ]
        },
        {
          "title": "Skin & Beauty",
          "href": "/phenome-store/store/#skin-and-beauty",
          "links": [
            { "label": "Multi-Collagen Powder", "href": "/phenome-store/supplements/multi-collagen-powder/" }
          ]
        }
      ]
    },
    {
      "key": "devices",
      "pin": true,
      "trigger": "Devices",
      "href": "/phenome-store/store/devices/",
      "columns": [
        /* Testing's arrangement (2026-09-22): lead doors, then one Shop column
           per device whose linked title opens its buy page and whose rows are the
           materials, then the plain help column, then two cards, the matte ring
           and the woven band. */
        {
          "title": "Explore devices",
          "lead": true,
          "links": [
            { "label": "PhenomeTech Ring", "href": "/phenome-store/devices/ring/" },
            { "label": "PhenomeTech Band", "href": "/phenome-store/devices/band/" }
          ]
        },
        {
          "title": "Shop the Ring",
          "href": "/phenome-store/store/phenometech-ring/",
          "links": [
            { "label": "Metal, from £179", "href": "/phenome-store/store/phenometech-ring/" },
            { "label": "Matte, from £189", "href": "/phenome-store/store/phenometech-ring/" },
            { "label": "Ceramic, from £199", "href": "/phenome-store/store/phenometech-ring/" }
          ]
        },
        {
          "title": "Shop the Band",
          "href": "/phenome-store/devices/band/",
          "links": [
            { "label": "Sport silicone, £149", "href": "/phenome-store/devices/band/" },
            { "label": "Woven nylon, £149", "href": "/phenome-store/devices/band/" }
          ]
        },
        {
          "title": "Get started",
          "links": [
            { "label": "Compare materials", "href": "/phenome-store/devices/ring/compare-materials/" },
            { "label": "Find your size", "href": "/phenome-store/devices/ring/find-your-size/" },
            { "label": "How it works", "href": "/phenome-store/devices/ring/how-it-works/" },
            { "label": "Warranty and returns", "href": "/phenome-store/devices/ring/warranty-returns/" }
          ]
        }
      ],
      "featured": [
        { "name": "Ring, Matte", "price": "from £189", "tag": "New",
          "href": "/phenome-store/store/phenometech-ring/",
          "img": "/phenome-store/assets/menu/tile-devices-ring-matte.webp" },
        { "name": "Band, Woven nylon", "price": "£149", "tag": "New",
          "href": "/phenome-store/devices/band/",
          "img": "/phenome-store/assets/menu/tile-devices-band-woven.webp" }
      ]
    },
    {
      "key": "app",
      "trigger": "App",
      "href": "/phenome-store/app/",
      "columns": [
        {
          "title": "Explore app",
          "lead": true,
          "links": [
            { "label": "Explore the app", "href": "/phenome-store/app/" },
            { "label": "Your dashboard", "href": "/phenome-store/app/dashboard/" },
            { "label": "Results and reports", "href": "/phenome-store/app/results-and-reports/" },
            { "label": "Trends over time", "href": "/phenome-store/app/trends/" }
          ]
        },
        {
          "title": "Get started",
          "links": [
            { "label": "Create an account", "href": "/phenome-store/account/" },
            { "label": "Activate a kit", "href": "/phenome-store/account/activate/" },
            { "label": "Book a session", "href": "/phenome-store/app/book-a-session/" }
          ]
        },
        {
          "title": "More from app",
          "links": [
            { "label": "Privacy and your data", "href": "/phenome-store/legal/privacy.html" },
            { "label": "App support", "href": "/phenome-store/contact/" }
          ]
        }
      ],
      "featured": [
        { "name": "See what the app tracks", "price": "", "tag": "Featured",
          "href": "/phenome-store/app/",
          "img": "/phenome-store/assets/menu/tile-app.webp" }
      ]
    },
    {
      "key": "science",
      "trigger": "Science",
      "href": "/phenome-store/science/",
      "columns": [
        {
          "title": "Explore science",
          "lead": true,
          "links": [
            { "label": "Our research", "href": "/phenome-store/science/our-research/" },
            { "label": "Whole genome sequencing", "href": "/phenome-store/science/whole-genome-sequencing/" },
            { "label": "Multiomics", "href": "/phenome-store/science/multiomics/" },
            { "label": "Systems biology", "href": "/phenome-store/science/systems-biology/" },
            { "label": "The Longevity Hub", "href": "/phenome-store/hub/" }
          ]
        },
        {
          "title": "About us",
          "links": [
            { "label": "Meet the team", "href": "/phenome-store/about/" },
            { "label": "Partner with us", "href": "/phenome-store/careers/" }
          ]
        }
      ],
      "featured": [
        { "name": "Our research", "price": "", "tag": "Featured",
          "href": "/phenome-store/science/our-research/",
          "img": "/phenome-store/assets/menu/tile-science-research.webp" }
      ]
    },
    {
      "key": "support",
      "trigger": "Support",
      "href": "/phenome-store/contact/",
      "columns": [
        {
          "title": "Get help",
          "links": [
            { "label": "Contact us", "href": "/phenome-store/contact/" },
            { "label": "Track order", "href": "/phenome-store/account/orders/" },
            { "label": "Activate a kit", "href": "/phenome-store/account/activate/" },
            { "label": "Returns and refunds", "href": "/phenome-store/devices/ring/warranty-returns/" },
            { "label": "Report a problem", "href": "/phenome-store/contact/" }
          ]
        },
        {
          "title": "Helpful topics",
          "links": [
            { "label": "Ring sizing", "href": "/phenome-store/devices/ring/find-your-size/" },
            { "label": "Privacy and your data", "href": "/phenome-store/legal/privacy.html" }
          ]
        }
      ],
      "featured": [
        { "name": "Talk to our team", "price": "", "tag": "Featured",
          "href": "/phenome-store/contact/",
          "img": "/phenome-store/assets/menu/tile-support-contact.webp" }
      ]
    }
  ];
  /* === end MENU DATA === */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  /* One panel, WHOOP's arrangement: link columns on the left, the lead column
     first, then the picture cards pushed to the right edge. The cards come AFTER
     the columns in the DOM as well as on screen, so Tab walks the links first
     and a screen reader hears the doors before the promotions. Cards link to a
     page and carry no purchase control — §6b allows a test to be explored
     anywhere and bought only on its own product page. */
  function panelHTML(p) {
    var h = '<div class="ph-panel" id="phPanel-' + p.key + '" data-panel="' + p.key + '" hidden>' +
            '<div class="ph-panel-inner">';

    /* The track count is still published for the drawer's one column grid and
       for any sheet that reads it; the desktop sheet is a flex row now. */
    h += '<div class="ph-panel-cols" style="--ph-cols:' + p.columns.length + '">';

    /* One row of a panel column. Four shapes, not one:
         rule  — a drawn divider. No label, no destination, and aria-hidden because
                 it says nothing a screen reader needs; it is a line.
         plain — a label the design draws with NO page behind it and none allowed
                 (Bugra: "olmayan hiçbir sayfayi oluşturma"). It must not be an <a>.
                 href="#" and href="" would both render something that looks like a
                 control and does nothing — the fake button the PRO-GUARD exists to
                 catch, and linkcheck skips both so neither would ever go red. A
                 <span> is honest: it reads as a label, it is not focusable, and it
                 cannot be clicked.
         small — the frame draws eight links a size down from their neighbours.
         link  — everything else. */
    function row(l) {
      if (l.rule) return '<span class="ph-panel-rule" aria-hidden="true"></span>';
      var note = l.note ? '<span class="ph-panel-note">' + esc(l.note) + '</span>' : '';
      var cls = l.small ? ' class="ph-panel-sm"' : '';
      if (l.plain) {
        return '<span' + (l.small ? ' class="ph-panel-label ph-panel-sm"'
                                  : ' class="ph-panel-label"') + '>' +
               esc(l.label) + note + '</span>';
      }
      return '<a href="' + esc(l.href) + '"' + cls +
             (l.todo ? ' data-todo-link' : '') + '>' + esc(l.label) + note + '</a>';
    }

    function colTitle(c, extra) {
      return c.href
        ? '<a class="ph-panel-col-t is-link' + extra + '" href="' + esc(c.href) + '">' + esc(c.title) + '</a>'
        : '<div class="ph-panel-col-t' + extra + '">' + esc(c.title) + '</div>';
    }

    p.columns.forEach(function (c, i) {
      /* --i staggers each column's rise by its position, left to right. */
      /* A column with `href` has a title that is itself the door: Shop genetic
         testing IS "shop all" for that category, so no separate row repeats it. */
      /* is-shop marks a column of products under a linked title; its product
         names are set a step up from the plain link columns. */
      h += '<div class="ph-panel-col' + (c.lead ? ' is-lead' : (c.href ? ' is-shop' : '')) +
           '" style="--i:' + i + '">' + colTitle(c, '');
      c.links.forEach(function (l) { h += row(l); });
      /* A second titled block stacked under this column rather than beside it —
         Supplements draws Skin & Beauty under Energy & Cognition and Everyday
         Essentials under Anti-Inflammatory. It lives INSIDE the column div, so
         the grid keeps its track count and nothing wraps. */
      if (c.below) {
        h += colTitle(c.below, ' ph-panel-col-t2');
        c.below.links.forEach(function (l) { h += row(l); });
      }
      h += '</div>';
    });
    h += '</div>';

    /* Square picture cards, caption and arrow on one line under the picture. The
       picture is decorative (alt=""), because the caption beside it is the link's
       whole name and a second reading of it would only repeat it. */
    if (p.featured && p.featured.length) {
      h += '<div class="ph-panel-feat">';
      p.featured.forEach(function (f, i) {
        h += '<a class="ph-feat" href="' + esc(f.href) + '" style="--i:' + (p.columns.length + i) + '">' +
             '<span class="ph-feat-img">' +
             (f.tag ? '<span class="ph-feat-tag">' + esc(f.tag) + '</span>' : '') +
             '<img src="' + esc(f.img) + '" alt="" loading="lazy" ' +
             'decoding="async" width="480" height="480"></span>' +
             '<span class="ph-feat-cap"><span class="ph-feat-name">' + esc(f.name) + '</span>' +
             '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">' +
             '<path d="M3 10h13.5M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" ' +
             'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>';
      });
      h += '</div>';
    }
    return h + '</div></div>';
  }

  /* hide() lives inside the nav block below, and the search overlay — which is built
     after it, from its own function — has to be able to shut an open mega-menu before
     it takes the bar over. One assignment out of that scope is cheaper than hoisting
     the whole panel machine up here, and it stays a no-op on a page with no nav. */
  var closeMenus = function () {};

  var nav = document.querySelector('[data-ph-nav]');
  if (nav) {
    /* Each panel sits inside its own .ph-item, after its trigger. That one
       arrangement gives both behaviours from CSS alone: on desktop the panel is
       positioned out of the flex row and hangs under the bar as a card; in the
       mobile drawer it stays in flow and reads as an accordion under its heading.
       The chevron added below sits between the two — nothing anywhere selects the
       panel as an adjacent sibling, and both behaviours still come from CSS with no
       second code path, but if you ever write `.ph-trigger + .ph-panel`, this is why
       it will not match. Keep the panel INSIDE the item; that part is load-bearing. */
    /* Clinic is not in the design's top row — it is the outlined pill on the right,
       and that pill IS the trigger for the Clinic panel. So it is built the same way
       as the others (item > trigger > chevron > panel, the one arrangement) but into
       a different container. Everything downstream selects on .ph-trigger and
       [data-trigger], so hover, keyboard, Escape and the active state all keep
       working without a second code path. */
    var triggers = '', clinicHTML = '';
    PH_MENU.forEach(function (p) {
      /* The trigger is a real link: clicking Store goes to /store/, the way every
         top-level item on Apple's bar does. It was a <button> that navigated nowhere,
         so the only way to reach the section itself was to open the panel and click
         again inside it.
         TWO of them have nowhere to go, and that is a decision, not an omission:
         Testing opens its panel only (Bugra, 2026-08-14: "testing sayfasi ŞİMDİLİK
         bir yere gitmesin" — for now, so this reverts the day he says so), and Clinic
         has no page at all because none may be created. Those carry href "" and are
         built as <button>, which is what a control that opens a panel and navigates
         nowhere actually is. An <a> without href is not focusable and announces
         nothing; an <a href="#"> would jump the page. Both look identical: .ph-trigger
         already resets background/border/padding and inherits the font, and the top
         row's letter-spacing comes from `.ph-links > .ph-item > .ph-trigger` (0,3,0),
         which outranks `.ph-trigger`'s own `normal` (0,1,0) for either element. */
      /* PINNED TRIGGERS, 2026-09-22 by request: Testing, Supplements and Devices
         do not navigate. A click pins their panel open (it stays when the pointer
         leaves the bar) and a second click, Escape or a click outside closes it.
         They are built as <button> for the reason given above; `href` stays in the
         data for search and for the current section mark. */
      var t = p.href && !p.pin
        ? '<a class="ph-trigger" href="' + esc(p.href) + '" data-trigger="' + p.key + '" ' +
          'aria-expanded="false" aria-controls="phPanel-' + p.key + '">' +
          esc(p.trigger) + '</a>'
        : '<button class="ph-trigger" type="button" data-trigger="' + p.key + '" ' +
          'aria-expanded="false" aria-controls="phPanel-' + p.key + '">' +
          esc(p.trigger) + '</button>';
      triggers += '<div class="ph-item">' + t +
                  /* …which means the label can no longer be the thing that opens the
                     panel wherever a tap navigates. This chevron is that control. It
                     carries NO visible word — its accessible name is the trigger's own
                     label, the same signed-off string from menu.json — because copy on
                     this site comes from Figma or the brief and a script writes none.
                     CSS alone decides where it shows (see .ph-toggle in shared.css);
                     the click handler below asks the CSS rather than carrying a second
                     copy of the breakpoint. */
                  '<button class="ph-toggle" type="button" data-toggle="' + p.key + '" ' +
                  'aria-label="' + esc(p.trigger) + '" aria-expanded="false" ' +
                  'aria-controls="phPanel-' + p.key + '">' +
                  '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" ' +
                  'focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" ' +
                  'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" ' +
                  'stroke-linejoin="round"/></svg></button>' +
                  panelHTML(p) + '</div>';
    });
    /* Split after the loop rather than inside it, so the markup for every panel is
       written in exactly one place. */
    (function () {
      var m = triggers.match(/<div class="ph-item">(?:(?!<div class="ph-item">)[\s\S])*?data-trigger="clinic"[\s\S]*?(?=<div class="ph-item">|$)/);
      if (m) { clinicHTML = m[0]; triggers = triggers.replace(m[0], ''); }
    })();

    nav.outerHTML =
      '<header class="ph-nav" id="phNav">' +
      '<div class="ph-nav-inner">' +
      '<a class="ph-brand" href="/phenome-store/index.html" aria-label="Phenome Longevity, home">' +
      '<img src="/phenome-store/assets/brand/phenome-logo.svg" alt="Phenome Longevity" width="770" height="118"></a>' +
      /* The design's top row is seven: Store, Testing, Supplements, Devices, App,
         Science, Support. Clinic sits on the RIGHT as an outlined pill and
         Longevity Hub is not in the row at all — it is reached from the Science
         panel, which is where the design puts it. Measured against
         docs/design-frames/phenome-navigation.png, 2026-08-13. */
      '<nav class="ph-links" id="phLinks">' + triggers + '</nav>' +
      '<div class="ph-nav-end">' +
      /* No "Find your test" here. It was ours, not the design's; Can asked twice for
         the frame's own header and overruled the argument for keeping it. The quiz
         is still linked from /testing/, /store/ and the Store panel. */
      clinicHTML +
      /* Search and cart are in the design and Can asked for them explicitly after
         being told neither function exists yet: "onları gene de ekle, onları
         developer halleder." They are NOT href="#" — each points at the real page
         that already exists, so nothing here is a dead control. The search page
         has no working search and the cart has no state; the developer wires both. */
      /* Still a real link to a real page. searchKit() below takes the click and opens
         the overlay instead; if that script never runs, the control still goes
         somewhere rather than sitting there doing nothing. */
      '<a class="ph-nav-icon" data-ph-search href="/phenome-store/hub/search/" aria-label="Search">' +
      '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="6"></circle>' +
      '<path d="M13.5 13.5 L18 18" stroke-linecap="round"></path></svg></a>' +
      /* Profile, 2026-09-22 by request: the icon only, onto the account page. */
      '<a class="ph-nav-icon ph-nav-profile" href="/phenome-store/account/" aria-label="Your account">' +
      '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="6.6" r="3.4"></circle>' +
      '<path d="M3.6 17.6c.9-3.3 3.4-5.1 6.4-5.1s5.5 1.8 6.4 5.1"></path></svg></a>' +
      '<a class="ph-nav-icon" href="/phenome-store/store/cart/" aria-label="Basket">' +
      '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6"><path d="M4 6h12l-1 11H5L4 6Z" ' +
      'stroke-linejoin="round"></path><path d="M7.5 6a2.5 2.5 0 0 1 5 0" ' +
      'stroke-linecap="round"></path></svg></a>' +
      '<button class="ph-burger" id="phBurger" aria-label="Menu" aria-expanded="false">' +
      '<span></span><span></span></button>' +
      '</div></div></header>';

    var header = document.getElementById('phNav');
    var open = null, openT = 0, closeT = 0;
    /* Which control opened the panel, so Escape hands focus back to it. Hover sets
       nothing, and then Escape falls back to the trigger, as it always did. */
    var openedBy = null;
    /* NOT `pinned`: a function of that name further down this IIFE drives the
       scroll pinned bands, and a var here would overwrite it. */
    var menuPin = false;   /* a pinned panel ignores the pointer leaving the bar */

    /* One panel now has two controls — the trigger, which a screen reader reaches
       first, and the chevron, which is what actually expands it wherever the label
       navigates. Their aria-expanded must never disagree, so nothing sets it alone. */
    function mark(key, state) {
      var trig = header.querySelector('[data-trigger="' + key + '"]');
      var tog = header.querySelector('[data-toggle="' + key + '"]');
      if (trig) trig.setAttribute('aria-expanded', state ? 'true' : 'false');
      if (tog) tog.setAttribute('aria-expanded', state ? 'true' : 'false');
    }

    /* THE VEIL UNDER AN OPEN PANEL, 2026-09-16 by request. The panel is a full
       bleed sheet now, the same one the search glass drops, so the page under it
       is frosted the same way rather than left legible around a floating card.
       One element, created on the first open and reused, and only at the widths
       where the panel IS that sheet — below 901 the panel is an accordion inside
       the drawer, which is already a full screen overlay of its own. */
    var wideBar = window.matchMedia('(min-width: 901px)');
    var menuScrim = null;
    function veil(on) {
      if (on && !wideBar.matches) { on = false; }
      if (on) {
        if (!menuScrim) {
          menuScrim = document.createElement('div');
          menuScrim.className = 'ph-menu-scrim';
          menuScrim.setAttribute('aria-hidden', 'true');
          /* A click on the veil closes the menu, which is what a reader expects
             of anything covering the page. */
          menuScrim.addEventListener('click', function () { hide(true); });
          document.body.appendChild(menuScrim);
        }
        menuScrim.hidden = false;
      } else if (menuScrim) {
        menuScrim.hidden = true;
      }
    }

    function show(key) {
      clearTimeout(closeT);
      if (open === key) return;
      hide(true);
      var panel = header.querySelector('[data-panel="' + key + '"]');
      if (!panel) return;
      panel.hidden = false;
      mark(key, true);
      open = key;
      /* The film homepage's nav is transparent white over the footage. An open panel
         needs a ground under it, so the nav drops to its solid state while it is up
         and returns to white when it closes. */
      document.documentElement.classList.add('ph-menu-open');
      veil(true);
    }

    function hide(immediate) {
      if (!open) { if (immediate) { document.documentElement.classList.remove('ph-menu-open'); veil(false); } return; }
      var panel = header.querySelector('[data-panel="' + open + '"]');
      if (panel) panel.hidden = true;
      mark(open, false);
      open = null;
      openedBy = null;
      menuPin = false;
      document.documentElement.classList.remove('ph-menu-open');
      veil(false);
    }

    /* Panels AND the drawer. Below 901 the search glass sits next to the burger, so
       the two overlays can be asked for one after the other; the drawer is a
       full-screen sheet and leaving it open underneath the search sheet gives the
       reader two menus and one Escape. */
    closeMenus = function () {
      hide(true);
      var drawer = document.getElementById('phLinks');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        var b = document.getElementById('phBurger');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    };

    var hoverable = window.matchMedia('(hover: hover) and (min-width: 901px)');

    header.querySelectorAll('.ph-trigger').forEach(function (t) {
      var key = t.getAttribute('data-trigger');
      var tog = t.parentNode.querySelector('.ph-toggle');

      t.addEventListener('mouseenter', function () {
        if (!hoverable.matches) return;
        clearTimeout(openT);
        /* A short intent delay: sweeping the pointer across the bar to reach
           something else must not flash three panels on the way past. */
        openT = setTimeout(function () {
          /* Sliding across to a neighbour keeps a pinned menu pinned. */
          var keep = menuPin;
          show(key);
          menuPin = keep && open === key;
        }, 120);
      });
      t.addEventListener('mouseleave', function () { clearTimeout(openT); });

      /* The trigger is a link, so a click follows it — and it is only ALLOWED to,
         because something else can always open the panel: hover on a pointer device,
         the chevron wherever the CSS shows one. Where there is neither — a touch
         screen still wide enough to keep the horizontal bar, i.e. a tablet in
         landscape — the first tap opens the panel and the second follows the link,
         which is what iOS has done to hover menus since the first iPad. The question
         is put to the CSS rather than to a second copy of the 901px breakpoint, so
         the two cannot drift apart. */
      /* A trigger with nowhere to go (Testing, Clinic) is a <button>, and for it
         every one of those escape hatches is wrong: there is no link for a click to
         follow, so returning early would leave a control that visibly does nothing.
         It toggles its own panel instead, on every device. */
      var isLink = t.tagName === 'A';

      t.addEventListener('click', function (e) {
        if (!isLink) {
          e.preventDefault();
          clearTimeout(openT);   /* the hover timer must not reopen what this click closes */
          /* Hover has usually opened it already, so the click's job is to PIN it;
             only a click on a panel that is already pinned closes it. */
          if (open === key && menuPin) { hide(true); return; }
          show(key); openedBy = t; menuPin = true;
          return;
        }
        if (hoverable.matches) return;
        if (tog && getComputedStyle(tog).display !== 'none') return;
        if (open === key) return;
        e.preventDefault();
        show(key);
      });

      /* The keyboard path on a hover device, where the chevron is not rendered.
         Enter follows the link now, so opening needs its own key: ArrowDown opens
         and the next Tab walks straight into the panel, which is the next thing in
         the DOM. Deliberately not an open-on-FOCUS handler — focus-to-open reopens
         the panel the instant Escape returns focus here, and traps the reader. */
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); show(key); openedBy = t; }
        else if (e.key === 'ArrowUp' && open === key) { e.preventDefault(); hide(true); }
      });
    });

    header.querySelectorAll('.ph-toggle').forEach(function (g) {
      var key = g.getAttribute('data-toggle');
      g.addEventListener('click', function () {
        if (open === key) { hide(true); return; }
        show(key);
        openedBy = g;
      });
    });

    header.addEventListener('mouseleave', function () {
      if (!hoverable.matches) return;
      clearTimeout(openT);
      if (menuPin) return;
      /* Grace on the way out: the pointer travels diagonally from the trigger to the
         panel and briefly leaves both. Closing instantly makes the menu unusable. */
      closeT = setTimeout(function () { hide(true); }, 180);
    });
    header.addEventListener('mouseenter', function () { clearTimeout(closeT); });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (open) {
        /* Read before hide(), which clears openedBy. Focus goes back to whichever
           control opened the panel — the chevron in the drawer, the trigger otherwise
           — so Escape never drops the reader somewhere they did not come from. */
        var back = openedBy || header.querySelector('[data-trigger="' + open + '"]');
        hide(true);
        if (back) back.focus();
        return;   /* one layer per press: the panel first, the drawer on the next one */
      }
      /* The drawer itself. Measured 2026-08-13 at 390 on 120 of 120 pages: it opened
         and Escape did nothing, because this handler returned early whenever no panel
         was open — and the drawer is the site's only full-screen overlay, which is
         precisely what the Esc rule exists for. The branch sits AFTER the panel case
         on purpose: put it before, and Escape would close the whole drawer out from
         under an open panel instead of closing the panel. */
      var drawer = document.getElementById('phLinks');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        var burgerEl = document.getElementById('phBurger');
        if (burgerEl) {
          burgerEl.setAttribute('aria-expanded', 'false');
          burgerEl.focus();
        }
      }
    });
    document.addEventListener('focusin', function (e) {
      if (open && !header.contains(e.target)) hide(true);
    });
    document.addEventListener('click', function (e) {
      if (open && !header.contains(e.target)) hide(true);
    });

    var burger = document.getElementById('phBurger');
    if (burger) burger.addEventListener('click', function () {
      var links = document.getElementById('phLinks');
      var isOpen = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (!isOpen) { hide(true); burger.focus(); return; }
      /* The drawer is written BEFORE .ph-nav-end in the nav template, so it precedes
         its own burger in the DOM while sitting below it on screen: measured at 390 on
         120 of 120 pages, Tab from the burger landed on page content at y=497, outside
         the open overlay. Moving focus to the first trigger makes the drawer reachable
         in the order it is read. */
      var first = links.querySelector('.ph-trigger, a');
      if (first) first.focus();
    });

    /* Exactly one trigger may be current, matched on the panel's own section only.
       Matching on member links instead lights up every panel that happens to link
       to where you are — Support links to Testing, so a testing page marked both. */
    var path = location.pathname, best = null;
    PH_MENU.forEach(function (p) {
      if (p.href.length > 1 && path.indexOf(p.href) === 0 &&
          (!best || p.href.length > best.href.length)) best = p;
    });
    if (best) {
      var bt = header.querySelector('[data-trigger="' + best.key + '"]');
      if (bt) bt.classList.add('active');
    }
    /* Triggers are excluded on purpose. They are anchors now, so this sweep would
       otherwise mark them too — and this sweep has no longest-prefix rule, which is
       the entire reason the block above exists. One owner per decision. */
    header.querySelectorAll('.ph-links a:not(.ph-trigger)').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href !== '/phenome-store/index.html' && path.indexOf(href) === 0) a.classList.add('active');
    });
  }

  var foot = document.querySelector('[data-ph-footer]');
  if (foot) {
    foot.outerHTML =
      '<footer class="ph-footer"><div class="wrap-wide">' +
      // line-height: the footer sets 14/18 on itself, so this 17px paragraph was
      // sitting in an 18px box — a ratio of 1.059, tighter than any heading on the
      // site and the only such pair anywhere. 25px is the tokens' loose offset for 17.
      '<p style="font-size:17px;line-height:25px;color:var(--ink);max-width:640px;margin:0 0 36px">Whole genome and microbiome testing for a longer, healthier life. At home, clinical grade, and built on the science.</p>' +
      '<div class="cols">' +
      '<div class="col"><div class="col-t">Testing</div>' +
      '<a href="/phenome-store/testing/gut-microbiome/">Gut Microbiome</a>' +
      '<a href="/phenome-store/testing/oral-microbiome/">Oral Microbiome</a>' +
      '<a href="/phenome-store/testing/comprehensive-genomic/">Comprehensive Genomic</a>' +
      '<a href="/phenome-store/testing/carrier-screening/">Carrier Screening</a>' +
      '<a href="/phenome-store/testing/newborn-screening/">Newborn Screening</a>' +
      '<a href="/phenome-store/testing/sports-performance/">Sports Performance</a>' +
      '<a href="/phenome-store/testing/microbiome/">Microbiome testing</a>' +
      '<a href="/phenome-store/testing/genetic/">Genetic testing</a></div>' +
      '<div class="col"><div class="col-t">Shop</div>' +
      '<a href="/phenome-store/devices/ring/">PhenomeTech Ring</a>' +
      '<a href="/phenome-store/supplements/">Supplements</a>' +
      '<a href="/phenome-store/store/">Shop all</a>' +
      '<a href="/phenome-store/quiz/">Shop by goal</a>' +
      '<a href="/phenome-store/store/microbiome/">Microbiome</a>' +
      '<a href="/phenome-store/store/genetic/">Genetic</a>' +
      '<a href="/phenome-store/store/devices/">Devices</a>' +
      '<a href="/phenome-store/store/supplements/">Supplements</a>' +
      '<a href="/phenome-store/store/cart/">Your bag</a>' +
      '<a href="/phenome-store/store/checkout/">Checkout</a></div>' +
      '<div class="col"><div class="col-t">Explore</div>' +
      '<a href="/phenome-store/science/">Science</a>' +
      '<a href="/phenome-store/science/whole-genome-sequencing/">Whole genome sequencing</a>' +
      '<a href="/phenome-store/science/multiomics/">Multiomics</a>' +
      '<a href="/phenome-store/science/systems-biology/">Systems biology</a>' +
      '<a href="/phenome-store/science/our-research/">Our research</a>' +
      '<a href="/phenome-store/app/">The App</a>' +
      '<a href="/phenome-store/app/#longevity-ai">Longevity AI</a>' +
      '<a href="/phenome-store/hub/">Longevity Hub</a>' +
      '<a href="/phenome-store/hub/podcast/">The Longevity Seat</a>' +
      '<a href="/phenome-store/hub/gut-guide/">The gut health guide</a>' +
      '<a href="/phenome-store/app/dashboard/">Your dashboard</a>' +
      '<a href="/phenome-store/app/results-and-reports/">Results and reports</a>' +
      '<a href="/phenome-store/app/trends/">Trends over time</a>' +
      '<a href="/phenome-store/app/book-a-session/">Book a session</a></div>' +
      '<div class="col"><div class="col-t">Company</div>' +
      '<a href="/phenome-store/about/">About</a>' +
      '<a href="/phenome-store/careers/">Careers</a>' +
      '<a href="/phenome-store/press/">Press</a>' +
      '<a href="/phenome-store/clinic/">The Clinic</a>' +
      '<a href="/phenome-store/clinic/what-to-expect/">What to expect</a>' +
      '<a href="/phenome-store/clinic/book/">Register your interest</a>' +
      '<a href="/phenome-store/contact/">Contact</a>' +
      '<a href="/phenome-store/testing/how-it-works/">How testing works</a>' +
      '<a href="/phenome-store/testing/compare/">Compare tests</a>' +
      '<a href="/phenome-store/devices/ring/compare-materials/">Compare ring materials</a>' +
      '<a href="/phenome-store/devices/ring/how-it-works/">How the Ring works</a>' +
      '<a href="/phenome-store/hub/search/">Search the Hub</a></div>' +
      '<div class="col"><div class="col-t">Support</div>' +
      '<a href="/phenome-store/contact/">Help centre</a>' +
      '<a href="/phenome-store/account/">Your account</a>' +
      '<a href="/phenome-store/account/orders/">Track an order</a>' +
      '<a href="/phenome-store/account/activate/">Activate a kit</a>' +
      '<a href="/phenome-store/legal/privacy.html">Privacy and data</a>' +
      '<a href="/phenome-store/legal/terms.html">Terms</a><a href="/phenome-store/sitemap/">Sitemap</a></div>' +
      '</div>' +
      '<div class="trust" style="margin-top:40px;border-bottom:0">' +
      '<span><b>ISO 15189</b> accredited lab</span>' +
      '<span><b>GDPR</b> compliant and encrypted</span>' +
      '<span>Built on <b>Illumina</b> sequencing</span>' +
      '<span><b>Clinician reviewed</b> reports</span></div>' +
      '<div class="rule"></div>' +
      /* The region switcher lives here, 2026-09-22 by request (moved out of the
         nav): the right end of the disclaimer row was the footer's one empty
         stretch. regionKit() fills the host; UI ONLY. */
      '<div class="foot-legal-row">' +
      '<p class="legal">Phenome tests are for wellness and information only and are not a substitute for professional medical advice, diagnosis or treatment. Samples are processed in accredited laboratories. Your data is encrypted and never sold.</p>' +
      '<div class="ph-region is-foot" data-ph-region></div>' +
      '</div>' +
      '<div class="bar"><span>© 2026 Phenome Longevity Ltd. All rights reserved.</span>' +
      /* The four platform names are the deck's own — group_j's Footer frame lists
         "Instagram", "YouTube", "LinkedIn", "X" — but Phenome has supplied no accounts,
         so there is no URL to put in an href and inventing one would send a visitor to
         somebody else's page. They shipped as <a href="#"> on every one of the 127
         pages this footer is injected into: 508 controls, all showing a pointer cursor
         and all doing nothing but jumping to the top. That is 88% of the 579 href="#"
         this site serves as static HTML; the other 71 are in page content.
         Spans keep every signed-off word and stop the promise. They inherit
         .ph-footer's own colour, which is the same grey as the copyright line they sit
         opposite — no rule in shared.css targets these, so nothing there has to change.
         The day the handles arrive this goes back to four anchors and one line. */
      '<span style="display:flex;gap:20px"><span>Instagram</span><span>YouTube</span><span>LinkedIn</span><span>X</span></span></div>' +
      '</div></footer>';
  }

  /* Settle each section in as it comes into view.

     The order here is the whole point: the class that lets shared.css hide anything
     goes on only after both capability checks pass. Write the CSS to hide by default
     and add a class to reveal, and every browser that cannot run this — and every
     reader who set prefers-reduced-motion — gets a blank page. So the page ships
     visible and this makes it animate, never the other way round.

     The hero is left alone. It is the first thing on screen and fading it in makes
     the site feel slow at exactly the moment it is being judged for speed.

     The observer is one instance for the page and unobserves each section once it
     has arrived: a band settles once, and scrolling back up does not replay it. */
  function reveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var main = document.querySelector('main');
    if (!main) return;

    var secs = [], kids = main.children, i;
    for (i = 0; i < kids.length; i++) {
      if (kids[i].tagName === 'SECTION' && !kids[i].classList.contains('hero')) secs.push(kids[i]);
    }
    if (!secs.length) return;

    document.documentElement.classList.add('ph-reveal');
    for (i = 0; i < secs.length; i++) secs[i].classList.add('ph-r');

    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (!entries[j].isIntersecting) continue;
        entries[j].target.classList.add('ph-in');
        io.unobserve(entries[j].target);
      }
    }, {
      /* A band starts settling a little before its top edge is reached, so it is
         upright by the time it is being read rather than arriving underneath the
         reader's eye. */
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.04
    });
    for (i = 0; i < secs.length; i++) io.observe(secs[i]);
  }

  /* ---- Hero drift ----------------------------------------------------------
     A hero that is simply *there* is the last still frame on a site that now moves
     everywhere else, and it is the first thing on screen.

     The picture opens 5.5% as you scroll past it, inside .hero-img's clipped rounded
     box. Progress is measured from pageYOffset against the hero's own height, not from
     the box's position in the viewport, so at the top of the page the transform is
     exactly scale(1) — identity. That matters beyond taste: audit_layout never
     scrolls, so it always measures this element at rest.

     Verified against every probe check. A transform leaves img.width and img.height
     untouched (they are layout dimensions), so the stretched check is structurally
     blind to it. .hero-img has no textContent, so it is not a candidate in the overlap
     comparison and its text sibling is then unpaired. Nothing moves horizontally.

     Guarded here rather than in the stylesheet, because an inline transform is neither
     a transition nor an animation and the reduced-motion block cannot reach it. The
     change listener is the part reveal() does not have: a reader who turns the setting
     on mid-session should get stillness without reloading, and stopping a loop is the
     one kind of motion that can be withdrawn cleanly. */
  function drift() {
    if (!('requestAnimationFrame' in window)) return;
    if (!('IntersectionObserver' in window)) return;
    var mql = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mql || mql.matches) return;

    var hero = document.querySelector('main > section.hero');
    if (!hero) return;
    var box = hero.querySelector('.hero-img, .hero-figure');
    if (!box) return;
    var img = box.querySelector('img');
    if (!img) return;

    document.documentElement.classList.add('ph-drift');

    var h = 1, live = true, queued = false, off = false;

    function measure() { h = Math.max(1, hero.offsetHeight); }
    function paint() {
      queued = false;
      if (off) return;
      var t = Math.min(1, Math.max(0, (window.pageYOffset || 0) / h));
      img.style.transform = 'scale(' + (1 + 0.055 * t).toFixed(4) + ')';
    }
    function tick() { if (live && !queued) { queued = true; requestAnimationFrame(paint); } }

    new IntersectionObserver(function (es) {
      live = es[0].isIntersecting;
      if (live) tick();
    }).observe(box);

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', function () { measure(); tick(); }, { passive: true });
    if (mql.addEventListener) mql.addEventListener('change', function () {
      if (!mql.matches) return;
      off = true; live = false;
      img.style.transform = '';
      document.documentElement.classList.remove('ph-drift');
    });

    measure();
    paint();
  }

  /* ---- Figures that count --------------------------------------------------
     The most interesting content on the Ring pages is its numbers, and .figures is the
     one place on this site where type goes to display size outside a heading. A number
     that is simply printed is a fact; a number that arrives is a measurement.

     Seventeen rows exist across three pages and this animates EIGHT of them —
     90, 94, 62, 88, 77, 20,000, 77 on /devices/ring/ and 30 on warranty-returns.
     4.2, 6, 1:1, 2, 4, 50+, 7d, 24/7 and Free are excluded by the regex or the >= 10
     floor: they are not quantities you can count to, and counting from zero to four is
     a twitch, not a measurement.

     Three things make this safe rather than clever, and each one was paid for:

     · Only the leading TEXT NODE is ever rewritten, never innerHTML. Nine of the
       seventeen rows carry a <small> holding the unit the number belongs to, and
       innerHTML destroys the split.

     · The numeral is locked to the width of the FINAL string before a digit changes.
       Outfit has no tabular figures: "0" is 31px and "20,000" is 162px, so an unlocked
       count drags the <small> up to 130px sideways, and at 390 the 20,000-genes row
       starts unwrapped at 43px tall and finishes wrapped at 83px — 40px of real layout
       shift under everything below it. audit_layout never scrolls, so an
       observer-gated count never fires inside its CLS window at all; that is luck, not
       safety, which is why the lock is mandatory anyway.

     · The final value is written back byte for byte on EVERY exit path, including the
       catch, and the true string is on the element as its accessible name from the
       first frame. A count that is interrupted halfway leaves a wrong number on a page
       that publishes "20,000 genes", and nothing ever reads a partial one aloud. */
  function figures() {
    if (!('IntersectionObserver' in window)) return;
    if (!('requestAnimationFrame' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var INT = /^\d{1,3}(,\d{3})*$/;   /* 90 · 20,000 — never 50+ · 7d · 24/7 · 4.2 · 1:1 */
    var DUR = 900;
    var nodes = document.querySelectorAll('.figure .n');
    var jobs = [], i;

    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i], t = n.firstChild;
      if (!t || t.nodeType !== 3) continue;
      var orig = t.nodeValue, trimmed = orig.trim();
      if (!INT.test(trimmed)) continue;
      var target = parseInt(trimmed.replace(/,/g, ''), 10);
      if (!(target >= 10)) continue;

      var run = document.createElement('span');
      n.insertBefore(run, t);
      run.appendChild(t);
      run.style.display = 'inline-block';
      run.style.minWidth = Math.ceil(run.getBoundingClientRect().width) + 'px';

      n.setAttribute('role', 'img');
      n.setAttribute('aria-label', n.textContent.trim());

      jobs.push({ el: n, node: t, orig: orig, to: target,
                  grouped: orig.indexOf(',') !== -1 });
    }
    if (!jobs.length) return;

    function group(v) {
      var s = String(v), out = '', c = 0, k;
      for (k = s.length - 1; k >= 0; k--) {
        out = s.charAt(k) + out;
        if (++c % 3 === 0 && k > 0) out = ',' + out;
      }
      return out;
    }

    function play(job) {
      var t0 = null;
      function tick(ts) {
        try {
          if (t0 === null) t0 = ts;
          var p = (ts - t0) / DUR;
          if (p >= 1) { job.node.nodeValue = job.orig; return; }
          var v = Math.round((1 - Math.pow(1 - p, 3)) * job.to);   /* lands, not stops */
          job.node.nodeValue = job.grouped ? group(v) : String(v);
          requestAnimationFrame(tick);
        } catch (e) {
          job.node.nodeValue = job.orig;
        }
      }
      requestAnimationFrame(tick);
    }

    /* Half the figure has to be on screen before it starts, or it is over before it has
       been looked at. One-shot, like the section reveal. */
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (!entries[j].isIntersecting) continue;
        io.unobserve(entries[j].target);
        for (var k = 0; k < jobs.length; k++) {
          if (jobs[k].el === entries[j].target) play(jobs[k]);
        }
      }
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.5 });

    for (i = 0; i < jobs.length; i++) io.observe(jobs[i].el);
  }

  /* ---- Stillness, mid-session ----------------------------------------------
     The reduced-motion check ran once, at load. Someone who turns the setting on while
     reading stayed on a moving site until they reloaded. Turning it on now drops the
     class that lets anything hide and marks every observed section arrived, so the page
     is painted immediately and stays painted.

     Turning it back off is deliberately not handled: content that is already on screen
     must not start animating underneath a reader. */
  function watchStill() {
    var mql = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mql || !mql.addEventListener) return;
    mql.addEventListener('change', function () {
      if (!mql.matches) return;
      var de = document.documentElement;
      de.classList.remove('ph-reveal');
      de.classList.remove('ph-drift');
      var r = document.querySelectorAll('.ph-r'), i;
      for (i = 0; i < r.length; i++) r[i].classList.add('ph-in');
    });
  }

  /* ---- The product bar ----------------------------------------------------
     A product page whose only way to buy sits at the very top and the very bottom is
     asking a reader six thousand pixels of scroll to remember where the button was.
     This is the pattern every product page on the web has, and this one did not.

     It authors nothing. The name is <title> up to the site suffix; the label and the
     destination are lifted from the hero's own primary button, so the bar can never
     offer a route the page does not already offer, and can never disagree with it.
     Deliberately no price: the Ring's is written six ways across this site, and a bar
     pinned to every screen is the worst possible place to pick one.

     Gated on a hero WITH a .btn, which is what makes it a product page rather than an
     article. An IntersectionObserver on the hero rather than a scroll handler: the bar
     is on exactly when the hero is off, which is one boolean and no arithmetic.

     visibility is animated alongside opacity — a bar at opacity 0 still swallows the
     clicks of whatever is under it, and this one is pinned across the top of the page. */
  /* The buy block's media slot, when it holds more than one photograph.

     Two ways to change frame and both are the reader's: it advances on its own every
     6s, and the arrows or the dots move it by hand. Taking hold STOPS the timer for
     good — a carousel that keeps moving under someone who has just chosen a frame is
     fighting them.

     The controls ship hidden in the markup and are unhidden HERE, which is the rule
     this project keeps relearning: never render a control before the thing that makes
     it work exists, or a page without JavaScript carries buttons that do nothing.

     Motion is opacity only — no transform on the frames, so nothing moves a layout box
     and audit_layout stays quiet. A reader who asked for less motion gets no timer and
     no cross-fade, just the arrows. */
  function carousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (box) {
      var frames = [].slice.call(box.querySelectorAll('img'));
      if (frames.length < 2) return;
      var prev = box.querySelector('[data-car-prev]');
      var next = box.querySelector('[data-car-next]');
      var dotBox = box.querySelector('.buy-dots');
      var dots = dotBox ? [].slice.call(dotBox.querySelectorAll('.buy-dot')) : [];
      [prev, next, dotBox].forEach(function (el) { if (el) el.hidden = false; });

      var i = 0, timer = null;
      var still = window.matchMedia('(prefers-reduced-motion: reduce)');
      /* ONE number, and it lives here. The CSS reads it back as --car-ms to size the
         fill bar, so the bar cannot promise a different moment than the timer keeps. */
      var EVERY = 6000;
      box.style.setProperty('--car-ms', EVERY + 'ms');

      function show(n) {
        i = (n + frames.length) % frames.length;
        frames.forEach(function (f, k) { f.hidden = k !== i; });
        dots.forEach(function (d, k) {
          var on = k === i;
          /* Reset the fill to empty with NO transition, then let it run. Without the
             reflow between the two writes the browser coalesces them and the bar
             never moves — it would sit full from the first frame onward. */
          var fill = d.querySelector('i');
          if (fill) {
            fill.style.transition = 'none';
            fill.style.transform = 'scaleX(0)';
            void fill.offsetWidth;
            fill.style.transition = '';
            fill.style.transform = '';
          }
          d.classList.toggle('on', on);
        });
      }
      /* Stop, and stay stopped. The class tells the CSS to fill the bar and hold it:
         a countdown that is no longer counting must not keep animating. */
      function take() {
        if (timer) { clearInterval(timer); timer = null; }
        box.classList.add('held');
      }

      if (prev) prev.addEventListener('click', function () { take(); show(i - 1); });
      if (next) next.addEventListener('click', function () { take(); show(i + 1); });
      dots.forEach(function (d, k) {
        d.addEventListener('click', function () { take(); show(k); });
      });

      /* Drive the FIRST frame through show() too. The markup marks dot 0 active, so
         without this its bar starts filling before --car-ms exists — the transition
         resolves to no duration and the bar is full on arrival, promising a change
         that is still six seconds away. */
      show(0);

      if (!still.matches) {
        timer = setInterval(function () { show(i + 1); }, EVERY);
        /* Nothing cycles off-screen: it is work nobody is watching, and it means the
           reader who scrolls back finds the frame they left rather than a random one. */
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function (es) {
            if (es[0].isIntersecting) {
              if (!timer) timer = setInterval(function () { show(i + 1); }, EVERY);
            } else if (timer) { clearInterval(timer); timer = null; }
          }, { threshold: 0 }).observe(box);
        }
      }
    });
  }

  /* The horizontal card rail's arrows.

     They do not own the scrolling — `overflow-x` does, and it already handles the
     trackpad gesture, the shift-wheel, the touch drag and the keyboard. These only
     nudge that same scroller by one card, so there is one implementation and not two.
     Apple's own rail works this way, which is why it feels right with any input.

     The buttons disable at the ends. A control that is live and does nothing is the
     fake control this project keeps removing; at an end this one is spent and says so. */
  function railx() {
    document.querySelectorAll('.railx').forEach(function (rail) {
      var track = rail.querySelector('.railx-track');
      var card = rail.querySelector('.railx-card');
      if (!track || !card) return;
      var btns = [].slice.call(rail.querySelectorAll('[data-railx]'));

      function step() {
        /* Measured from the DOM, never assumed: the card width comes from CSS that
           changes at three widths, and the gap is a token. Reading it back means the
           arrow always moves exactly one card however the layout has resolved. */
        var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
        return card.getBoundingClientRect().width + gap;
      }
      function sync() {
        var max = track.scrollWidth - track.clientWidth;
        btns.forEach(function (b) {
          var d = +b.getAttribute('data-railx');
          b.disabled = d < 0 ? track.scrollLeft <= 1 : track.scrollLeft >= max - 1;
        });
      }
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          track.scrollBy({ left: step() * +b.getAttribute('data-railx'), behavior: 'smooth' });
        });
      });
      track.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
    });
  }

  /* The scroll-pinned moment: which point is showing.

     READS the scroll, never takes it. The section's height and `position: sticky` do
     all the work in CSS; this only turns the section's own progress into an index and
     toggles a class. No wheel listener, no preventDefault, no scrollTo — so a trackpad
     fling, PageDown, a screen reader and the scrollbar all behave exactly as they do
     everywhere else on the page. That is the difference between Apple's version of this
     and the ones that feel broken.

     A reader who asked for less motion gets every point at once and this never runs. */
  function pinned() {
    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('.pin').forEach(function (pin) {
      var pts = [].slice.call(pin.querySelectorAll('.pin-pt'));
      if (!pts.length) return;
      if (still.matches) { pts.forEach(function (p) { p.classList.add('on'); }); return; }

      var stage = pin.querySelector('.pin-stage');
      var cur = -1;
      function frame() {
        var r = pin.getBoundingClientRect();
        /* Progress across the stretch where the stage is STUCK — 0 the moment it
           latches, 1 the moment the section lets it go. Both ends are read off the
           stage rather than assumed: `run` is the section's height minus the stage's,
           and `top` is the sticky offset the CSS resolved. That used to be hardcoded
           as "the stage is one viewport tall and sticks at 0", which was true until
           the stage took the film's own 16:7 height and started sticking centred —
           at which point the points would have arrived early and finished before the
           band released. Ask the element, not the layout you remember. */
        var sh = stage ? stage.offsetHeight : window.innerHeight;
        var top = stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
        var run = pin.offsetHeight - sh;
        var p = run > 0 ? Math.min(Math.max((top - r.top) / run, 0), 1) : 0;
        /* The last point holds for the final screen rather than flicking past it. */
        var i = Math.min(Math.floor(p * pts.length), pts.length - 1);
        if (i !== cur) {
          cur = i;
          pts.forEach(function (el, n) { el.classList.toggle('on', n === i); });
        }
      }
      var queued = false;
      function onScroll() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; frame(); });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      frame();
    });
  }

  /* THE TIMELINE · a rail that fills with the scroll (phenome-glass.css § 9).

     PROMOTED FROM supplements/nad/nad.js 2026-09-16 with the component it
     drives, so the two pages that carry a "when does this start working"
     section cannot drift apart again. Every number below is nad's.

     WHY THE RAIL IS MEASURED RATHER THAN DIVIDED. The stages carry different
     amounts of copy, so four equal quarters would put the line above or below
     the dot it is meant to arrive at. The rail is set to run dot to dot — from
     the first step's marker to the last's — and progress is read against that
     box. Re-measured on resize and again once the webfont has loaded, because
     the fallback face sets to a different height and every offset moves with
     it.

     THE LINE IS AT 62% OF THE VIEWPORT, which is below the middle on purpose:
     a stage should light as the reader reaches it, not once it has already
     gone past. The first stage is the exception and lights a little early
     (-40px), so the section never greets anyone with four dimmed stages.

     It READS the scroll, it never takes it. No pinning, no scroll hijack, no
     preventDefault: the wheel, a fling, PageDown and the scrollbar all behave
     exactly as they do everywhere else. */
  function timelines() {
    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    var boxes = [].slice.call(document.querySelectorAll('[data-ph-tl]'));
    var floats = [].slice.call(document.querySelectorAll('[data-ph-float]'));
    if (!boxes.length && !floats.length) return;
    if (!('requestAnimationFrame' in window)) return;

    var frames = [];
    boxes.forEach(function (box) {
      var rail = box.querySelector('.ph-tl-rail');
      var fill = rail && rail.querySelector('i');
      var steps = [].slice.call(box.querySelectorAll('.ph-tl-step'));
      if (!rail || !fill || steps.length < 2) return;

      function layout() {
        var first = steps[0].offsetTop + 14;
        var last = steps[steps.length - 1].offsetTop + 14;
        rail.style.top = first + 'px';
        rail.style.bottom = 'auto';
        rail.style.height = Math.max(0, last - first) + 'px';
      }
      layout();
      window.addEventListener('resize', layout);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

      if (still.matches) {
        fill.style.setProperty('--p', 1);
        steps.forEach(function (s) { s.classList.add('on'); });
        return;
      }

      var last = -1;
      frames.push(function () {
        var line = window.innerHeight * 0.62;
        var r = rail.getBoundingClientRect();
        var p = r.height ? Math.min(Math.max((line - r.top) / r.height, 0), 1) : 0;
        if (Math.abs(p - last) < 0.001) return;
        last = p;
        fill.style.setProperty('--p', p.toFixed(4));
        steps.forEach(function (s, i) {
          var on = i === 0 ? (line - r.top) > -40 : p >= (i / (steps.length - 1)) - 0.001;
          s.classList.toggle('on', on);
        });
      });
    });

    /* The collage tiles drift a little against each other, which is what stops
       three rectangles reading as a contact sheet. Opt in per tile with
       data-ph-float, whose value is the direction and the multiplier. */
    if (floats.length && !still.matches) {
      frames.push(function () {
        var vh = window.innerHeight;
        floats.forEach(function (f) {
          var r = f.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          var c = (r.top + r.height / 2 - vh / 2) / vh;
          f.style.translate = '0 ' + (c * 28 * +f.getAttribute('data-ph-float')).toFixed(1) + 'px';
        });
      });
    }

    if (!frames.length) return;
    var queued = false;
    function paint() { queued = false; frames.forEach(function (f) { f(); }); }
    function tick() { if (!queued) { queued = true; requestAnimationFrame(paint); } }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    paint();
  }

  function productBar() {
    if (!('IntersectionObserver' in window)) return;

    var hero = document.querySelector('main > section.hero');
    if (!hero) return;
    var cta = hero.querySelector('a.btn');
    if (!cta || !cta.getAttribute('href')) return;

    /* The site suffix is separated by a comma now, not an em dash: the copy pass of
       2026-09-15 took every joining dash out of the visible text, <title> included.
       Split on the same character the titles are actually written with, or this reads
       "Carrier Screening Test, Phenome Longevity" as the product's whole name. */
    var name = (document.title || '').split(',')[0].trim();
    if (!name) return;

    var bar = document.createElement('div');
    bar.className = 'ph-bar';
    /* Not a landmark and not a heading: it is a repeat of a control already on the
       page, so it announces itself as such and stays out of the document outline. */
    bar.setAttribute('aria-hidden', 'true');
    var inner = document.createElement('div');
    inner.className = 'ph-bar-inner';
    /* The name is a control now, not a caption. This bar only exists once the hero is
       off screen, which is precisely when a reader wants the top of the page back, and
       the name is the largest thing in it — people were already clicking it. A <button>
       rather than an <a href="#top">: there is no #top anchor to point at and a bare
       "#" writes a history entry that Back then has to be pressed twice to escape.
       It carries a real accessible name so it is not a mystery control to a reader who
       cannot see which product page they are on. */
    var n = document.createElement('button');
    n.type = 'button';
    n.className = 'ph-bar-name';
    n.textContent = name;
    /* `title`, not `aria-label`. Two pages rewrite this element's textContent after
       shared.js has run (ring-lab renames it, the PDP and the Band re-parent it), and
       an aria-label would then be announcing a product name the button no longer
       shows. A title leaves the visible words as the accessible name — which is what
       "label in name" asks for anyway — and adds the hint on top of it. */
    n.setAttribute('title', 'Back to top');
    n.setAttribute('tabindex', '-1');
    n.addEventListener('click', toTop);
    var a = document.createElement('a');
    a.className = 'btn small';
    a.setAttribute('href', cta.getAttribute('href'));
    a.setAttribute('tabindex', '-1');
    a.textContent = cta.textContent.trim();
    inner.appendChild(n);
    inner.appendChild(a);
    bar.appendChild(inner);
    document.body.appendChild(bar);

    new IntersectionObserver(function (es) {
      var off = !es[0].isIntersecting;
      bar.classList.toggle('on', off);
      /* THE SWAP, and it is set here rather than on each page that wanted it.
         Five pages had grown their own copy of this line — the ring PDP, the
         Band, devices/ring, ring-lab and the NAD page — and every page that had
         NOT copied it was showing two bars at once: the global nav pinned at 0
         and the product bar stacked directly under it. One class, set by the one
         observer that already knows where the hero is, and shared.css § "the
         swap" does the rest. See that block for what the class means. */
      document.body.classList.toggle('is-past-hero', off);
      bar.setAttribute('aria-hidden', off ? 'false' : 'true');
      a.setAttribute('tabindex', off ? '0' : '-1');
      n.setAttribute('tabindex', off ? '0' : '-1');
    }, { threshold: 0 }).observe(hero);
  }

  /* ---- Back to the top ----------------------------------------------------
     One way up, shared by the product bar's name and the floating button below, so the
     two can never disagree about what "back to top" means.

     scrollTo() is given an object, which older Safari does not accept — it wants two
     numbers and throws on the object form — so the fallback is not decoration. And the
     smooth behaviour is dropped for a reader who asked for less motion: on a page this
     long, a smooth scroll is several seconds of the whole viewport moving. */
  function toTop() {
    var still = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  /* ---- The floating way up -------------------------------------------------
     A disc in the bottom-right corner that appears once the page has been scrolled
     past its first screen — the point at which the nav's own logo has been gone long
     enough that a reader has to hunt for a way back.

     One viewport is the threshold the brief asked for, and it is read from the window
     on every check rather than cached: a phone that turns, or a desktop window that is
     dragged taller, changes what "one screen" means.

     It is built here rather than written into 84 pages, and it is built by script on
     purpose — a button that scrolls is useless without script, so shipping it in the
     markup would leave one more dead control on a page where JavaScript failed. It
     sits in the corner the design system's own launcher already occupies, and stacks
     above it; see .ph-top in shared.css for how the two share the corner. */
  function backToTop() {
    if (!('requestAnimationFrame' in window)) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ph-top';
    btn.setAttribute('aria-label', 'Back to top');
    /* Hidden from the reading order while it is off screen, the same contract the
       product bar keeps: a control nobody can see must not be the next Tab stop. */
    btn.hidden = true;
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" ' +
      'focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 19V6"></path><path d="M5.5 12.5 12 6l6.5 6.5"></path></svg>';
    btn.addEventListener('click', function () {
      toTop();
      /* Focus has to go somewhere a reader can carry on from, and the button is about
         to disappear under them. The document itself is the top of the page. */
      var brand = document.querySelector('.ph-brand');
      if (brand) brand.focus({ preventScroll: true });
    });
    document.body.appendChild(btn);

    var queued = false, shown = false;
    function paint() {
      queued = false;
      var past = (window.pageYOffset || document.documentElement.scrollTop || 0) >
                 window.innerHeight;
      if (past === shown) return;
      shown = past;
      /* hidden first, then the class, so the disc has a box to animate out of; and
         the other way round on the way out, so it fades before it leaves. */
      if (past) { btn.hidden = false; requestAnimationFrame(function () { btn.classList.add('on'); }); }
      else { btn.classList.remove('on'); }
    }
    btn.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'opacity' && !shown) btn.hidden = true;
    });
    function tick() { if (!queued) { queued = true; requestAnimationFrame(paint); } }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    paint();
  }

  /* ---- The search overlay --------------------------------------------------
     The glass in the bar used to navigate to /hub/search/, a page with a static list of
     nine results for "bloating" and no field that does anything. Clicking search and
     LOSING the page you were reading, to arrive somewhere that cannot search, is the
     worst of both. Apple's bar does the opposite: the glass opens over the page, the
     bar's own links step aside, and a field arrives already holding somewhere to go.

     This is that, with our own content in it. Three things make it Apple's rather than
     a generic dropdown, and each one is a decision:

     · It opens with QUICK LINKS already listed. An empty panel asks the reader to
       think of something; a panel with six destinations in it answers the question
       most people came to ask without a keystroke.

     · Typing REPLACES that list with matches, ranked — an exact label first, then a
       label that starts with what was typed, then a word inside it, then a substring,
       then the keywords and the section the link lives in. Apple's list reorders the
       same way, which is why the thing you meant is nearly always first.

     · A query that matches NOTHING collapses the list, exactly as apple.com does, and
       says so in one quiet line rather than falling back to the quick links. Silently
       showing unrelated links after a miss is how a search loses trust.

     The index is READ OFF THE MENU, not authored twice: every product card, every
     column link and every panel in PH_MENU becomes a row here, so a link cannot exist
     in search and be missing from the site, or move in one and not the other. The
     extras below are the pages the bar has no panel for — the Hub, the account, the
     legal pages — and they are the only rows written by hand. */
  var PH_FIND_EXTRA = [
    { label: 'Shop all', href: '/phenome-store/store/', section: 'Store',
      keys: 'store shop buy everything products' },
    { label: 'Longevity Hub', href: '/phenome-store/hub/', section: 'Explore',
      keys: 'articles guides reading blog' },
    { label: 'The Longevity Seat', href: '/phenome-store/hub/podcast/', section: 'Explore',
      keys: 'podcast episodes listen audio' },
    { label: 'The gut health guide', href: '/phenome-store/hub/gut-guide/', section: 'Explore',
      keys: 'bloating digestion ibs microbiome guide' },
    { label: 'Search the Hub', href: '/phenome-store/hub/search/', section: 'Explore',
      keys: 'find results' },
    { label: 'Find your test', href: '/phenome-store/quiz/', section: 'Store',
      keys: 'quiz recommend where to start not sure goal' },
    { label: 'Your account', href: '/phenome-store/account/', section: 'Support',
      keys: 'sign in log in login profile' },
    { label: 'Track an order', href: '/phenome-store/account/orders/', section: 'Support',
      keys: 'delivery shipping dispatch parcel where is my order' },
    { label: 'Activate a kit', href: '/phenome-store/account/activate/', section: 'Support',
      keys: 'register barcode sample code' },
    { label: 'Your bag', href: '/phenome-store/store/cart/', section: 'Store',
      keys: 'basket cart checkout' },
    { label: 'Checkout', href: '/phenome-store/store/checkout/', section: 'Store',
      keys: 'pay payment order' },
    { label: 'The App', href: '/phenome-store/app/', section: 'Explore',
      keys: 'iphone android dashboard longevity ai' },
    { label: 'Your dashboard', href: '/phenome-store/app/dashboard/', section: 'Explore',
      keys: 'app scores home' },
    { label: 'Results and reports', href: '/phenome-store/app/results-and-reports/', section: 'Explore',
      keys: 'pdf report omics portfolio findings' },
    { label: 'Trends over time', href: '/phenome-store/app/trends/', section: 'Explore',
      keys: 'app history charts progress' },
    { label: 'Book a session', href: '/phenome-store/app/book-a-session/', section: 'Explore',
      keys: 'genetic counsellor appointment call consultation' },
    { label: 'The Clinic', href: '/phenome-store/clinic/', section: 'Company',
      keys: 'london in person visit' },
    { label: 'What to expect at the clinic', href: '/phenome-store/clinic/what-to-expect/', section: 'Company',
      keys: 'visit appointment first time' },
    { label: 'Register your interest', href: '/phenome-store/clinic/book/', section: 'Company',
      keys: 'clinic waiting list enquire' },
    { label: 'Science', href: '/phenome-store/science/', section: 'Explore',
      keys: 'research evidence method' },
    { label: 'Whole genome sequencing', href: '/phenome-store/science/whole-genome-sequencing/', section: 'Explore',
      keys: 'wgs dna genome illumina' },
    { label: 'Multiomics', href: '/phenome-store/science/multiomics/', section: 'Explore',
      keys: 'layers proteome transcriptome' },
    { label: 'Systems biology', href: '/phenome-store/science/systems-biology/', section: 'Explore',
      keys: 'networks pathways' },
    { label: 'Our research', href: '/phenome-store/science/our-research/', section: 'Explore',
      keys: 'papers publications studies' },
    { label: 'About', href: '/phenome-store/about/', section: 'Company',
      keys: 'who we are company story lab' },
    { label: 'Careers', href: '/phenome-store/careers/', section: 'Company',
      keys: 'jobs hiring roles work with us' },
    { label: 'Press', href: '/phenome-store/press/', section: 'Company',
      keys: 'media news coverage' },
    { label: 'Contact us', href: '/phenome-store/contact/', section: 'Support',
      keys: 'help support email phone customer service' },
    { label: 'Privacy and data', href: '/phenome-store/legal/privacy.html', section: 'Support',
      keys: 'gdpr encryption deletion consent' },
    { label: 'Terms', href: '/phenome-store/legal/terms.html', section: 'Support',
      keys: 'legal conditions' },
    { label: 'Sitemap', href: '/phenome-store/sitemap/', section: 'Support',
      keys: 'all pages index' },
    { label: 'Design system', href: '/phenome-store/design-system/', section: 'Company',
      keys: 'tokens type colour components' }
  ];

  /* Words people type that are nowhere in a link's own label. Nobody searches for
     "Gut Microbiome Test" — they search for "bloating", which is the word that sent
     them looking. These attach to rows the menu has already produced and change
     nothing a reader sees: a row is matched on them and still listed under its own
     signed-off name. Keyed by href, so a page that moves takes its words with it. */
  var PH_FIND_KEYS = {
    '/phenome-store/store/phenometech-ring/':
      'sleep heart rate hrv recovery readiness wearable titanium ceramic finger',
    '/phenome-store/devices/ring/':
      'sleep heart rate hrv recovery readiness wearable titanium ceramic finger',
    '/phenome-store/devices/band/': 'wearable wrist steps screen sleep activity',
    '/phenome-store/store/gut-microbiome/':
      'bloating digestion ibs stool bacteria diversity fibre',
    '/phenome-store/testing/gut-microbiome/':
      'bloating digestion ibs stool bacteria diversity fibre',
    '/phenome-store/testing/oral-microbiome/': 'mouth saliva gums teeth breath',
    '/phenome-store/testing/comprehensive-genomic/':
      'dna genome sequencing wgs variants risk panels',
    '/phenome-store/testing/carrier-screening/':
      'family planning inherited recessive partner pregnancy',
    '/phenome-store/testing/newborn-screening/': 'baby infant newborn paediatric',
    '/phenome-store/testing/sports-performance/':
      'training athlete fitness recovery endurance injury',
    '/phenome-store/store/supplements/': 'nad capsules powder vitamins collagen'
  };

  /* Six, because seven starts to read as a menu rather than a shortcut. Each one names
     BOTH the destination and the wording it should be listed under: several of these
     pages are reachable from the bar under a second label — /quiz/ is "Not sure where
     to start" inside the Store panel, which is a fine thing to hover over and a poor
     thing to read at the top of a search sheet. Both halves are checked against the
     index when the list is built, so a quick link cannot outlive the page it names. */
  /* ---- REGION, 2026-09-22 by request ------------------------------------------
     The round flag pill from ultrahuman.com/se (round flag, a hairline pill),
     in the FOOTER's disclaimer row, opening UPWARD into a small menu of two
     regions. First drawn in the nav, moved here the same day. UI ONLY: the
     choice swaps the pill, marks <html data-region> and is remembered per
     browser. Prices, copy and routes do not change. Flags are inline SVG so the
     pill needs no request; ids are made unique per drawing because the trigger
     and the menu draw the same flag twice. */
  var PH_REGIONS = [
    { code: 'UK', name: 'United Kingdom', money: '£ GBP', flag: 'gb' },
    { code: 'TR', name: 'Türkiye', money: '₺ TRY', flag: 'tr' }
  ];
  var flagN = 0;
  function flagSVG(f) {
    if (f === 'tr') {
      return '<svg class="ph-flag" viewBox="0 0 30 30" aria-hidden="true" focusable="false">' +
        '<rect width="30" height="30" fill="#E30A17"/><circle cx="12" cy="15" r="7.2" fill="#fff"/>' +
        '<circle cx="13.9" cy="15" r="5.8" fill="#E30A17"/>' +
        '<path fill="#fff" d="M16.1 15 18.23 14.3 18.24 12.05 19.57 13.86 21.71 13.18 20.4 15 ' +
        '21.71 16.82 19.57 16.14 18.24 17.95 18.23 15.71Z"/></svg>';
    }
    var id = 'phGbClip' + (++flagN);
    return '<svg class="ph-flag" viewBox="15 0 30 30" aria-hidden="true" focusable="false">' +
      '<clipPath id="' + id + '"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>' +
      '<rect width="60" height="30" fill="#012169"/>' +
      '<path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/>' +
      '<path d="M0 0l60 30m0-30L0 30" clip-path="url(#' + id + ')" stroke="#C8102E" stroke-width="4"/>' +
      '<path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>' +
      '<path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>';
  }

  function regionKit() {
    var host = document.querySelector('[data-ph-region]');
    if (!host) return;
    var KEY = 'phenome.region.v1';
    var cur = 'UK';
    try { var saved = localStorage.getItem(KEY); if (saved === 'UK' || saved === 'TR') cur = saved; } catch (e) {}
    function byCode(c) { return PH_REGIONS.filter(function (r) { return r.code === c; })[0]; }

    host.innerHTML =
      '<span class="ph-region-k" aria-hidden="true">Shopping from</span>' +
      '<button class="ph-region-btn" type="button" aria-haspopup="true" aria-expanded="false" ' +
      'aria-controls="phRegionMenu"></button>' +
      '<div class="ph-region-menu" id="phRegionMenu" role="menu" aria-label="Choose your region" hidden>' +
      '<div class="ph-region-h">Choose your region</div>' +
      PH_REGIONS.map(function (r) {
        return '<button class="ph-region-opt" type="button" role="menuitemradio" data-region="' + r.code + '">' +
          flagSVG(r.flag) +
          '<span class="ph-region-txt"><span class="ph-region-name">' + esc(r.name) + '</span>' +
          '<span class="ph-region-money">' + esc(r.money) + '</span></span>' +
          '<svg class="ph-region-tick" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
          '<path d="M4.5 10.5 8.3 14 15.5 6" fill="none" stroke="currentColor" stroke-width="1.9" ' +
          'stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
      }).join('') +
      '</div>';

    var btn = host.querySelector('.ph-region-btn');
    var menu = host.querySelector('.ph-region-menu');
    var opts = Array.prototype.slice.call(host.querySelectorAll('.ph-region-opt'));

    function paint() {
      var r = byCode(cur);
      btn.innerHTML = flagSVG(r.flag) + '<span class="ph-region-code">' + esc(r.name) + '</span>' +
        '<svg class="ph-region-chev" viewBox="0 0 12 12" aria-hidden="true" focusable="false">' +
        '<path d="M2.5 7.5 6 4l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.setAttribute('aria-label', 'Region, ' + r.name + '. Change region');
      opts.forEach(function (o) {
        o.setAttribute('aria-checked', o.getAttribute('data-region') === cur ? 'true' : 'false');
      });
      document.documentElement.setAttribute('data-region', cur.toLowerCase());
    }
    function setOpen(on, focusBack) {
      if (on) {
        closeMenus();
        menu.hidden = false;
        /* next frame, so the opening transition has a closed state to leave */
        requestAnimationFrame(function () { host.classList.add('is-open'); });
        var sel = host.querySelector('.ph-region-opt[aria-checked="true"]') || opts[0];
        sel.focus({ preventScroll: true });
      } else {
        host.classList.remove('is-open');
        menu.hidden = true;
        if (focusBack) btn.focus({ preventScroll: true });
      }
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    function isOpen() { return !menu.hidden; }

    btn.addEventListener('click', function () { setOpen(!isOpen(), false); });
    opts.forEach(function (o, i) {
      o.addEventListener('click', function () {
        cur = o.getAttribute('data-region');
        try { localStorage.setItem(KEY, cur); } catch (e) {}
        paint();
        setOpen(false, true);
        host.classList.add('is-changed');
        setTimeout(function () { host.classList.remove('is-changed'); }, 600);
      });
      o.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length].focus();
        }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) setOpen(false, true);
    });
    document.addEventListener('pointerdown', function (e) {
      if (isOpen() && !host.contains(e.target)) setOpen(false, false);
    });
    host.addEventListener('focusout', function (e) {
      if (isOpen() && e.relatedTarget && !host.contains(e.relatedTarget)) setOpen(false, false);
    });
    paint();
  }

  var PH_FIND_QUICK = [
    { href: '/phenome-store/store/', label: 'Shop all' },
    { href: '/phenome-store/store/phenometech-ring/', label: 'PhenomeTech Ring' },
    { href: '/phenome-store/quiz/', label: 'Find your test' },
    { href: '/phenome-store/hub/', label: 'Longevity Hub' },
    { href: '/phenome-store/account/orders/', label: 'Track an order' },
    { href: '/phenome-store/account/activate/', label: 'Activate a kit' }
  ];

  function searchKit() {
    var header = document.getElementById('phNav');
    if (!header) return;
    var btn = header.querySelector('[data-ph-search]');
    var inner = header.querySelector('.ph-nav-inner');
    if (!btn || !inner) return;

    /* ---- the index -------------------------------------------------------- */
    /* ONE row per destination. The same page is often reachable from the bar under two
       wordings — /quiz/ is both "Not sure where to start" and "Find your test" — and a
       list that offers the reader the same page twice under two names is a list they
       have to read twice. A later add() MERGES into the row that is already there and
       keeps both sets of keywords, so nothing that used to match stops matching.

       Which LABEL survives is the whole reason for the third argument. Inside the menu
       pass the first one wins: /store/phenometech-ring/ is listed as both "PhenomeTech
       Ring" and "Ceramic Ring" (one page, two materials) and last-wins would file the
       Ring under the ceramic. The curated extras below then override, because that is
       what they are for. */
    var index = [], byHref = {};
    function add(label, href, section, keys, rename) {
      if (!label || !href) return;
      var row = byHref[href];
      if (row) {
        if (rename) { row.label = label; row.lab = label.toLowerCase(); }
        row.keys = (row.keys + ' ' + (keys || '')).trim().toLowerCase();
        row.hay = (row.hay + ' ' + label + ' ' + (keys || '')).toLowerCase();
        return;
      }
      row = { label: label, href: href, section: section || '',
              keys: (keys || '').toLowerCase(),
              hay: (label + ' ' + (section || '') + ' ' + (keys || '')).toLowerCase(),
              lab: label.toLowerCase() };
      byHref[href] = row;
      index.push(row);
    }
    PH_MENU.forEach(function (p) {
      if (p.href) add(p.trigger, p.href, p.trigger, '');
      (p.featured || []).forEach(function (f) {
        add(f.name, f.href, p.trigger, f.price || '');
      });
      (p.columns || []).forEach(function (c) {
        if (c.href) add(c.title, c.href, p.trigger, '');
        (c.links || []).forEach(function (l) {
          add(l.label, l.href, p.trigger + ', ' + c.title, '');
        });
        if (c.below && c.below.href) add(c.below.title, c.below.href, p.trigger, '');
        if (c.below) (c.below.links || []).forEach(function (l) {
          add(l.label, l.href, p.trigger + ', ' + c.below.title, '');
        });
      });
    });
    PH_FIND_EXTRA.forEach(function (e) { add(e.label, e.href, e.section, e.keys, true); });
    Object.keys(PH_FIND_KEYS).forEach(function (href) {
      var row = byHref[href];
      if (!row) return;   /* the page left the menu; its words leave with it */
      row.keys = (row.keys + ' ' + PH_FIND_KEYS[href]).trim();
      row.hay = row.hay + ' ' + PH_FIND_KEYS[href];
    });

    var quick = [];
    PH_FIND_QUICK.forEach(function (q) {
      var row = byHref[q.href];
      if (row && row.label === q.label) quick.push(row);
    });
    if (!quick.length) quick = index.slice(0, 6);

    /* ---- the ranking ------------------------------------------------------
       Lower is better, and every term in the query has to land somewhere or the row is
       out: typing "ring size" must not surface every page with the word "ring" in it.
       The row's score is the WORST of its terms' scores, so a row that only just
       matches one word cannot be lifted above a row that matches both well. */
    function score(item, terms) {
      var worst = 0;
      for (var i = 0; i < terms.length; i++) {
        var q = terms[i], s;
        if (item.lab === q) s = 0;
        else if (item.lab.indexOf(q) === 0) s = 1;
        else if ((' ' + item.lab).indexOf(' ' + q) !== -1) s = 2;
        else if (item.lab.indexOf(q) !== -1) s = 3;
        else if ((' ' + item.keys).indexOf(' ' + q) !== -1) s = 4;
        /* WORD START in the haystack, never a bare substring. The keywords carry words
           like "hiring", and a bare indexOf put Careers in the results for "ring" —
           one row of nonsense is enough to make a reader stop trusting the list. */
        else if ((' ' + item.hay).indexOf(' ' + q) !== -1) s = 5;
        else return -1;
        if (s > worst) worst = s;
      }
      return worst;
    }

    function results(query) {
      var q = query.trim().toLowerCase();
      if (!q) return null;
      var terms = q.split(/\s+/), out = [], i;
      for (i = 0; i < index.length; i++) {
        var s = score(index[i], terms);
        if (s !== -1) out.push({ item: index[i], s: s, i: i });
      }
      out.sort(function (a, b) { return a.s - b.s || a.i - b.i; });
      /* ONE ROW PER NAME. With the section marker gone from the row, two pages that
         share a name (the Gut Microbiome Test in the store and in testing) would be
         two identical lines. The better ranked one stays. */
      var seen = {};
      out = out.filter(function (r) {
        if (seen[r.item.lab]) return false;
        seen[r.item.lab] = true;
        return true;
      });
      return out.slice(0, 8).map(function (r) { return r.item; });
    }

    /* ---- the overlay ------------------------------------------------------ */
    var box = document.createElement('div');
    box.className = 'ph-search';
    box.hidden = true;
    /* REBUILT ON support.apple.com's search, 2026-09-15, by request. The bar stays
       where it is and a panel drops from under it: one large borderless field with
       no placeholder, then the quick links, set at the same size as their heading
       and with nothing beside them, no glyph and no section name. There is no
       Cancel; the glass in the bar, Escape, and a click on the frosted page all
       close it. */
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Search');
    box.innerHTML =
      '<div class="ph-search-sheet">' +
      '<div class="ph-search-sheet-inner">' +
      '<div class="ph-search-field">' +
      '<svg class="ph-search-glass" viewBox="0 0 20 20" width="18" height="18" ' +
      'aria-hidden="true" focusable="false" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6"><circle cx="9" cy="9" r="6"></circle>' +
      '<path d="M13.5 13.5 L18 18" stroke-linecap="round"></path></svg>' +
      '<input class="ph-search-input" id="phSearchInput" type="text" ' +
      'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ' +
      'aria-label="Search" ' +
      'role="combobox" aria-expanded="true" aria-controls="phSearchList" ' +
      'aria-autocomplete="list">' +
      '<button class="ph-search-clear" type="button" aria-label="Clear the search" hidden>' +
      '<svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" ' +
      'focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round"><path d="M6 6l8 8M14 6l-8 8"></path></svg></button>' +
      '</div>' +
      '<p class="ph-search-head" id="phSearchHead">Quick links</p>' +
      '<ul class="ph-search-list" id="phSearchList" role="listbox" ' +
      'aria-labelledby="phSearchHead"></ul>' +
      '</div></div>';
    inner.appendChild(box);

    var scrim = document.createElement('div');
    scrim.className = 'ph-search-scrim';
    scrim.hidden = true;
    document.body.appendChild(scrim);

    var input = box.querySelector('.ph-search-input');
    var clear = box.querySelector('.ph-search-clear');
    var list = box.querySelector('.ph-search-list');
    var head = box.querySelector('.ph-search-head');
    var rows = [], active = -1, isOpen = false;

    /* The matched run is marked inside the label so the reader can see WHY a row is
       there. Built from text nodes rather than a string of HTML: a label is site copy
       and site copy is never concatenated into innerHTML in this file. */
    function label(item, terms) {
      var span = document.createElement('span');
      span.className = 'ph-search-label';
      var text = item.label, low = item.lab, at = -1, len = 0, i;
      for (i = 0; i < terms.length; i++) {
        var p = low.indexOf(terms[i]);
        if (p !== -1 && (at === -1 || p < at)) { at = p; len = terms[i].length; }
      }
      if (at === -1) { span.textContent = text; return span; }
      span.appendChild(document.createTextNode(text.slice(0, at)));
      var b = document.createElement('b');
      b.textContent = text.slice(at, at + len);
      span.appendChild(b);
      span.appendChild(document.createTextNode(text.slice(at + len)));
      return span;
    }

    function draw(items, terms) {
      list.textContent = '';
      rows = [];
      active = -1;
      items.forEach(function (item, n) {
        var li = document.createElement('li');
        li.setAttribute('role', 'presentation');
        var a = document.createElement('a');
        a.className = 'ph-search-row';
        a.href = item.href;
        a.id = 'phSearchRow-' + n;
        a.setAttribute('role', 'option');
        a.setAttribute('aria-selected', 'false');
        a.appendChild(label(item, terms || []));
        a.addEventListener('mouseenter', function () { mark(n); });
        li.appendChild(a);
        list.appendChild(li);
        rows.push(a);
      });
    }

    function empty(query) {
      list.textContent = '';
      rows = [];
      active = -1;
      var li = document.createElement('li');
      li.className = 'ph-search-none';
      li.textContent = 'No suggestions for “' + query.trim() + '”';
      list.appendChild(li);
    }

    function mark(n) {
      if (active > -1 && rows[active]) {
        rows[active].classList.remove('on');
        rows[active].setAttribute('aria-selected', 'false');
      }
      active = n;
      if (active > -1 && rows[active]) {
        rows[active].classList.add('on');
        rows[active].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', rows[active].id);
        return;
      }
      input.removeAttribute('aria-activedescendant');
    }

    function render() {
      var q = input.value;
      clear.hidden = !q;
      var found = results(q);
      if (found === null) {
        head.textContent = 'Quick links';
        head.hidden = false;
        draw(quick, []);
        return;
      }
      if (!found.length) {
        head.hidden = true;
        empty(q);
        return;
      }
      head.textContent = 'Suggestions';
      head.hidden = false;
      draw(found, q.trim().toLowerCase().split(/\s+/));
    }

    function open() {
      if (isOpen) return;
      isOpen = true;
      closeMenus();
      box.hidden = false;
      scrim.hidden = false;
      document.documentElement.classList.add('ph-search-open');
      btn.setAttribute('aria-expanded', 'true');
      input.value = '';
      render();
      /* After the class, so the field is laid out before it is focused — focusing a
         zero-width input scrolls the bar sideways on iOS. */
      requestAnimationFrame(function () { input.focus(); });
    }

    function close(back) {
      if (!isOpen) return;
      isOpen = false;
      box.hidden = true;
      scrim.hidden = true;
      document.documentElement.classList.remove('ph-search-open');
      btn.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      if (back !== false) btn.focus();
    }

    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isOpen) close(); else open();
    });

    input.addEventListener('input', render);
    clear.addEventListener('click', function () {
      input.value = '';
      render();
      input.focus();
    });
    scrim.addEventListener('click', function () { close(); });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!rows.length) return;
        e.preventDefault();
        var n = active + (e.key === 'ArrowDown' ? 1 : -1);
        if (n < 0) n = rows.length - 1;
        if (n >= rows.length) n = 0;
        mark(n);
        return;
      }
      if (e.key === 'Enter') {
        /* Enter with nothing highlighted takes the first row, which is the ranking's
           own best answer — the same bargain Apple's field makes. With no rows at all
           it does nothing: there is no results page to send a query to, and sending
           the reader somewhere that cannot answer them is the behaviour this overlay
           replaced. */
        var go = rows[active > -1 ? active : 0];
        if (!go) { e.preventDefault(); return; }
        e.preventDefault();
        location.href = go.getAttribute('href');
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); close(); }
    });

    /* Escape anywhere, and a click that lands outside the bar. The nav's own Escape
       handler runs on the document too and closes a panel first; this one is only
       reached when no panel is open, because opening the overlay closed them all. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) close();
    });
    document.addEventListener('focusin', function (e) {
      if (isOpen && !box.contains(e.target) && e.target !== btn) close(false);
    });
  }

  /* The shop rails' arrows.
     The nav slot ships EMPTY in the markup and this fills it — the page arrives with
     a rail a finger, a trackpad or the Tab key can already move, and the arrows are
     an addition for pointer users. The other way round (ship the buttons, wire them
     later) leaves two dead controls on any page where the script does not run, which
     is the same "fake button" this page had fifteen of.
     qa_final fails the build on ONE console error, so every lookup is guarded. */
  function rails() {
    var tracks = document.querySelectorAll('[data-rail]');
    if (!tracks.length) return;
    if (!('requestAnimationFrame' in window)) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

    for (var i = 0; i < tracks.length; i++) wire(tracks[i]);

    function wire(track) {
      var slot = track.parentElement &&
                 track.parentElement.querySelector('[data-rail-nav]');
      if (!slot || slot.firstChild) return;   // idempotent: never wire the same rail twice
      var raf = 0;
      var prev = mk('‹', 'Show previous products', -1);
      var next = mk('›', 'Show more products', 1);
      slot.appendChild(prev);
      slot.appendChild(next);
      sync();

      track.addEventListener('scroll', function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { raf = 0; sync(); });
      }, { passive: true });
      window.addEventListener('resize', sync, { passive: true });

      function mk(glyph, label, dir) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ph-rail-btn';
        b.textContent = glyph;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', function () {
          var first = track.firstElementChild;
          var step = (first ? first.getBoundingClientRect().width : 300) + 16;
          track.scrollBy({
            left: dir * step * 2,
            behavior: (reduce && reduce.matches) ? 'auto' : 'smooth'
          });
        });
        return b;
      }
      function sync() {
        var max = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= max;
      }
    }
  }

  reveal();
  drift();
  figures();
  rails();
  watchStill();
  searchKit();
  regionKit();
  backToTop();
  productBar();
  carousels();
  railx();
  pinned();
  timelines();
  faq();
  cartKit();

  /* Questions · one card open at a time, and a close that collapses.

     Native <details> has two problems for a question list. It will happily
     leave six answers open at once, which turns a scannable list into a wall;
     and it removes its own content the instant `open` goes away, so the card
     that closes snaps shut while the card that opens glides. Both are fixed
     here rather than in the markup, so a page without script still has six
     working <details> and nothing is hidden from a reader or a crawler.

     The opening animation is CSS (`.acc.is-faq .acc-body`, a 0fr to 1fr grid
     row in shared.css). Closing has to be driven from here because the row
     needs to finish shrinking BEFORE `open` is removed. */
  function faq() {
    var lists = document.querySelectorAll('[data-faq-list]');
    if (!lists.length) return;
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    for (var i = 0; i < lists.length; i++) bind(lists[i]);

    function bind(list) {
      list.addEventListener('click', function (e) {
        var sum = e.target.closest('summary');
        if (!sum) return;
        var item = sum.parentNode;
        if (item.parentNode !== list) return;
        e.preventDefault();
        if (item.open) { close(item); return; }
        var open = list.querySelector('details[open]');
        if (open && open !== item) close(open);
        item.open = true;
      });
    }

    /* Shrink the row, then drop `open` when it has finished. The inline
       grid-template-rows wins over the [open] rule for the length of the
       animation and is cleared straight after, so the sheet stays in charge. */
    function close(item) {
      var body = item.querySelector('.acc-body, .nd-acc-body');
      if (!body || calm) { item.open = false; return; }
      body.style.gridTemplateRows = '1fr';
      body.offsetHeight;                                  /* commit the start */
      body.style.gridTemplateRows = '0fr';
      var done = false;
      function end() {
        if (done) return;
        done = true;
        body.removeEventListener('transitionend', end);
        item.open = false;
        body.style.gridTemplateRows = '';
      }
      body.addEventListener('transitionend', end);
      setTimeout(end, 600);                 /* if the transition never fires */
    }
  }

  /* The cart drawer rides on every page that loads this file, so 80 pages do
     not each need their own two tags. The base comes from this script's own
     src, the same way phenome-routes.js finds it. */
  function cartKit() {
    var me = document.currentScript;
    if (!me || document.querySelector('script[src$="/store/cart/cart.js"]')) return;
    var base = me.src.replace(/\/shared\.js.*$/, '');
    if (!document.querySelector('link[href$="/store/cart/cart.css"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = base + '/store/cart/cart.css';
      document.head.appendChild(l);
    }
    var s = document.createElement('script');
    s.src = base + '/store/cart/cart.js';
    document.body.appendChild(s);
  }
})();
