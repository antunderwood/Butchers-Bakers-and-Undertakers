# Design decisions — Abbots Langley High Street

Main design file: `Main.dc.html` (published canvas: `abbots-langley-high-street.html`).
Alternate directions explored and kept for reference: `DirectionArchive.dc.html`,
`DirectionFete.dc.html`, `DirectionGallery.dc.html`.

## Brief

A site showing Abbots Langley's High Street shops over time — before/after
comparisons, an interactive map, inspired by the Local History Society's
"Butchers, Bakers & Undertakers" project (allhs.org.uk).

## Direction

Three low-fidelity directions were sketched first: **Archive** (monochrome
parish ledger), **Fete** (hand-drawn scrapbook), **Gallery** (dark modern
kiosk). The user picked Fete, then asked for a mashup of Fete with the Main
layout — that became the working design.

A later request ("Typewolf site of the day 'Board', Nimbus Sans L, modern
picture-driven backgrounds, parallax") replaced the Fete look entirely with an
editorial neo-grotesque style: full-bleed photography, oversized display
type, minimal colour, no hand-drawn motifs. This is the current direction.

- **Type**: `Inter Tight` (variable 400 to 900) in `index.html`,
  self-hosted from `fonts/` (Latin subset only, 45 KB, SIL OFL 1.1 with
  `fonts/OFL.txt` alongside) so no visitor data goes to Google. No preload
  hint: it throws a CORS error when the page is opened from `file://`.
  Chosen as the closest webfont relative of Nimbus Sans L
  (not available on a CDN) so Windows no longer falls back to Arial.
  `Helvetica Neue` stays as the fallback. Inter Tight is already tightly
  spaced, so display tracking is -0.03em rather than -0.045em.
- **Palette**: warm cream (`--cream #f4f0e6`) / near-black ink, with a single
  olive CTA accent and a rust accent for selection state. Chosen for a
  quiet, paper-and-photograph feel rather than a branded palette (no
  existing brand to match).
- **Layout**: full-bleed hero and map imagery, content constrained to a
  `.wrap` (1240px) elsewhere. Oversized headline overlaps the hero photo
  edge into the page background, in the style of the reference site.

## Content honesty

*Superseded for `index.html` by "Directory of Shops content" below; still
true of `Main.dc.html`.* No historical photographs or confirmed shop records
existed for this project at first (the source page is a project announcement, not a populated directory).
Rather than fabricate specific facts, the page:

- Labels every historical trade as **"trade unconfirmed"**.
- Uses real, licensed **example photography**, clearly captioned as
  examples rather than the confirmed record:
  - `photo-al-high-street.jpg` — Abbots Langley High Street today,
    © Diane Sambrook, CC BY-SA 2.0 (via Geograph / Wikimedia Commons).
  - `photo-vintage-highstreet.jpg` — English high street, c. 1905,
    Martin Ridley Collection, public domain (Wikimedia Commons).
  - `photo-heritage-butcher.jpg` — traditional butcher's shop, Diss,
    © Evelyn Simak, CC BY-SA 2.0 (Wikimedia Commons).
  - `street-map.jpg` — OpenStreetMap tiles, © OpenStreetMap contributors,
    ODbL. Captured chrome-free (no search box / nav / zoom controls) via
    a cropped screenshot of the live map.
- Uses **real, current shop names** for the map/"now" side (Pin Wei,
  Cinnamon Lodge, Beautiful You, Noor Mahal, Underground Barbers, Ansells,
  Budgens, Boots) — pulled from OpenStreetMap's POI data for that stretch
  of High Street, since that's verifiable public information, unlike the
  historical trades.
- All attribution is credited in the footer per each licence's terms.

## Interaction

- **Before/after comparison**: implemented as pointer-drag directly on the
  photograph (not a separate `<input type="range">`), using
  `setPointerCapture` so the drag continues even if the pointer leaves the
  element. Same mechanic on the hero and all 8 shop cards.
- **Map navigation** (index.html, Sept 2026): jump-scrolling from a pin
  down to its card broke the back-and-forth between map and shops, so the
  shop now opens in a panel docked beside the map (a bottom sheet on phones,
  `position: sticky` so it leaves with the section). The map stays live:
  another pin swaps the panel, prev/next walks the street in order, and
  "All shops" returns to the chips. The open shop is in the URL hash
  (`#noor-mahal`), so Back/Forward and shared links work; pin and chip
  clicks push history, prev/next replaces it. Grid cards link back with
  "Show on map".
- **Brief and full cards**: the map panel is a brief card (compare photo,
  number, name, trade, one to two sentence summary) with Read more, which jumps to the
  shop's Then & Now card (`#about-<id>`) and opens its full description.
  Then & Now cards show the same summary, with the description in a
  `<details>` Read more toggle (animated where `::details-content` is
  supported). Text lives in each `TRADES` entry's `summary` and
  `description` fields, to be written by the user; empty fields show
  honest placeholders.
- **Leader line**: a rust line joins the open shop's marker to its card
  (to the card's left edge on desktop, the sheet's top edge on phones).
  It is redrawn in the rAF loop, so it tracks flyTo, drags, zoom and the
  sticky sheet, and hides when the marker leaves the map view. On phones
  the map centres the marker in the part the sheet leaves uncovered.
- **Map**: Leaflet 1.9.4, vendored in `vendor/leaflet/` (BSD 2-Clause),
  on OpenStreetMap tiles, so the map can grow with the shop list and pan or
  zoom along the whole street. Markers use real OSM coordinates (the `osm`
  field names each element). Scroll-wheel zoom is off and phones pan with
  two fingers, so the map never traps page scrolling. The map is capped at
  `min(520px, 70vh)` tall: an earlier full-width, full-aspect-ratio map was
  too tall ("ridiculous amount of screen real estate"). The chips stay so
  navigation doesn't depend on precisely tapping a small pin.
  Ported to `Main.dc.html`: there Leaflet loads from jsdelivr (with the
  same integrity hashes) because the canvas bundle ships no local folders,
  the shop view clones the rendered grid card (the canvas only resolves
  literal `src` attributes), and history calls are wrapped in case the
  preview sandboxes them. Checked in Chrome through a local harness that
  expands the templates, not in the canvas itself.
- **Parallax**: implemented as a `requestAnimationFrame` loop reading
  `getBoundingClientRect()` each frame and setting `transform: translateY()`
  directly via refs — not a `scroll` event listener. The event-listener
  version silently did nothing in this canvas preview (the page can scroll
  without firing a `scroll` event on the frame's `window`); the rAF poll
  is scroll-mechanism-agnostic and works regardless.

## Motion and type pass (index.html, Sept 2026)

Applied to `index.html` and ported to `Main.dc.html` (same CSS, copied
verbatim). The published canvas bundle `abbots-langley-high-street.html` has
not been republished yet.

`Main.dc.html` notes: all behaviour is imperative DOM work in
`componentDidMount` (no `setState`, so the template never re-renders over
inline styles). Stagger delays live in CSS `nth-child` rules rather than
inline custom properties. Knockout fills take the hero images' resolved
`src` at mount, because the canvas only rewrites literal `src` attributes.
The canvas bundle does not contain `fonts/`, so the canvas falls back to
Helvetica Neue until it is republished with the font.

- **Knockout headline**: hero h1 uses `mix-blend-mode: difference`, so letters
  read light over the photo and dark over the page, splitting mid-glyph at the
  photo edge. Footer headline and the trades marquee use photo-filled
  (`background-clip: text`) letters; the footer adds a cream wash so dark
  photo areas stay legible.
- **Load**: hero opens from an inset rounded frame, headline lines rise from
  masks, then a one-off slider sweep teaches the drag (cancelled on touch).
- **Scroll**: IntersectionObserver reveals (hidden only under `html.js`),
  intro paragraph inks in line by line, header progress bar, header turns
  dark over dark sections. All scroll-linked work stays in the rAF loop.
- **Hover**: rolling nav/button labels, liquid button fill, pin and chip
  hover-linked, cards follow the mouse and settle back to centre.
- **Accessibility**: sliders are keyboard operable (`role="slider"`, arrows,
  Home/End); `touch-action: pan-y` so the hero no longer traps vertical
  scrolling on phones; `prefers-reduced-motion` disables all motion.
- **Honesty fixes**: fabricated "No. N High Street" replaced by "Marker N";
  "Then" caption moved to the side it describes (it was hidden under "Now").

## Known bugs fixed along the way

- Embedded images referenced through a JS-computed `style` hole (a CSS
  `background` shorthand, or a computed `src`) never resolved — this
  preview's image-embedding only rewrites `src="literal-filename.jpg"`
  occurrences that exist verbatim in the `.dc.html` source, not values
  assembled at render time. Fixed by using literal `<img src="...">` tags
  gated with `<sc-if>` where the image needed to vary per item.

## Open items / honest gaps

- Real historical trade, proprietor and date data for each shop is still
  needed from the Local History Society's Directory — every "Then" caption
  is a placeholder.
- Photographs are examples illustrating the *kind* of image each slot wants,
  not the confirmed photo for that address.
- `street-map.jpg` is no longer used by either page; the published
  canvas bundle still has the old static map until it is republished.
- OSM tags Pin Wei as `disused:amenity=restaurant`, so it may have closed.
  Ansells is a bookmaker in OSM (it was listed as a florist before).

## Directory of Shops content (index.html, Oct 2026)

The site now carries the Society's own "A Directory of Shops in Abbots
Langley High Street" (BBU team, updated June 2026), supplied by the user as
a PDF, with web use of its photographs, adverts and Prue King's drawings
cleared by the user.

- **Files**: the page code is split for reuse. `site.css` and `site.js` are
  shared, `data/directory.js` holds every entry (74, transcribed from the
  PDF, footnotes kept as `{n}` and shown as superscripts naming the source),
  `img/directory/` holds the images. `index.html` is the front page and
  `directory.html?section=<key>` serves the four sections.
- **Front page**: at most 10 `featured` entries, chosen for having a
  then/now photo pair and a long timeline, walked north to south. The
  directory pair printed above no. 22 actually shows no. 20 ("Abbots Langley
  Supply Stores"), so 20 Noor Mahal is featured, not 22-26.
- **Sub-pages**: one per directory section (odd numbers, Langley Parade,
  even numbers, Causeway Parade) with the same map, panel and cards. Every
  entry appears on its section page, featured or not. Houses and lost
  buildings have no map marker but still open in the panel.
- **Entries**: neighbouring numbers the directory treats together, or that
  share one photo or OSM element, are merged with sub-headings (2 & 4,
  22-26, 30 & 32, 38 & 38a, 39 & 41). Cards show the first three occupants;
  the rest, adverts and drawings sit under Read more.
- **Text**: as the directory, including living proprietors' and residents'
  names (the user's choice), except that its dashes are written as commas
  or colons. Marker positions come from OpenStreetMap; no. 16 is still
  "Your Move" in OSM.
- **Images**: extracted by rendering each region of the PDF at its source
  resolution. Then/now photos are all 960x720 (4:3, centre-cropped), adverts
  and drawings fit within 800x800; all JPEG quality 80.
- **Phone nav**: four header links overflowed a 390px screen and zoomed the
  whole page out (which also broke scroll targets), so the Map link hides
  below 480px.
- `Main.dc.html` has not been given the directory content or sub-pages.
- **Full view**: the map card's expand button (and its Full details link)
  opens the whole entry in a `<dialog>`: large then/now photo, every
  occupant, adverts and drawings, and the sources written out, since title
  tooltips on footnotes don't work on touch. URL `#full-<id>`, so Back
  closes it and it can be shared; prev/next step inside it and keep the map
  card behind in step; closing always lands on the shop's map view
  (replaceState), so it never jumps back to the first shop. Full screen on
  phones. On the front page the card and full view also link to the
  shop's section page with it open (`directory.html?section=<key>#<id>`).

## UX pass (Oct 2026)

- **Finder**: a search box over all 74 entries and every occupant, plus
  trade filters (butchers, bakers, undertakers, grocers, drapers, pubs,
  banks, chemists, post offices, hairdressers, shoes) defined as regexes in
  `TRADES` in `site.js`. Matches on the current page light up on the map
  and filter the chips; the results list covers every section and opens
  each entry on the map with its preview card, so the result is seen in
  place first. On the front page every result previews there, even entries
  from other sections: they join the map as a guest marker (no chip, no
  prev/next) until another shop opens, and their full view opens on their
  section's page with the search carried over, so Back returns to the front
  page with the search and preview as they were. On a section page, results
  from other sections open that section's page. The search
  is kept in the URL (`?q=` or `?t=`), so it survives Back and can be shared.
- **Hero and claims**: the hero is now a real directory pair, Henderson Hall
  and its neighbours then and now (`img/hero-*.jpg`, 1200x750), darkened in
  the hero so the knockout headline stays legible. The intro and timeline
  no longer claim Elizabethan origins: the directory's earliest dated trade
  is the King's Head (1756), so the copy says that, and the timeline's
  milestones are directory facts (1756, 1826, 1902, 1920s, 1958, 1982).
- **Map clarity**: markers are shaded by side of the street (dark for odd
  and Langley Parade, light for even and Causeway Parade) with a key where
  both sides show; overlapping markers are nudged to the nearest free spot
  with a stem and dot at their true position, recomputed on zoom; the front
  page fits the central cluster, so no. 81 no longer zooms the view out.
- **Polish**: each card's Read more and the full view carry a "Know more
  about ...? Email the BBU team" link with the address as the subject; on
  section pages prev/next run on into the neighbouring section; the card's
  close button says Close; favicon and link-preview tags (`img/og.jpg`).
- **Phones**: below 560px the header links fold into a Menu button with a
  solid dropdown (inline links overflowed narrow screens and large text
  settings, zooming the page out); the timeline runs vertically with the
  line on the left; card grid columns use `minmax(0, 1fr)` and long words
  wrap, so nothing overflows a 320px screen.

## Sections by side of the street (Oct 2026)

Counts styled like house numbers (big outlined 39, 8, 19, 8 on the section
tiles, counts on the tabs, a "10 / 39" position on the map card) were being
read as addresses. Now only house numbers look like house numbers:

- Sections are named and arranged by side: "High Street, south side" (the
  odd numbers, the directory's south-east side) with Langley Parade, and
  "High Street, north side" (even numbers) with Causeway Parade. The front
  page shows two columns, one per side, each tile led by its address range
  ("Nos. 1 to 87") with the count in words beneath.
- Directory tabs are grouped under South side and North side, named by
  place, with no counts. Every address reads with its side, e.g. "17 High
  Street, south side".
- The map card shows the section name where it showed a position.
- Links name the section: `directory.html?section=south-side|langley-parade|north-side|causeway-parade`,
  plus `#<shop>` or `#full-<shop>` and an optional `&q=`/`&t=` search.

## Hosting (Oct 2026)

Served by Cloudflare at https://allhs-bbu.flying-ant.uk/ as a static-assets
Worker (`wrangler.jsonc`: no Worker script, no build step), replacing GitHub
Pages. Workers Builds is connected to the GitHub repo, so a push to `main`
deploys. The assets directory is the repo root and `.assetsignore` is an
allowlist (the two pages, `site.css`, `site.js`, `favicon.svg`, `data/`,
`img/`, `fonts/`, `vendor/`), so the design canvases, `canvas.json`, early
drafts and unused photos stay in the repo but are not published. The custom
domain comes from the `routes` entry, which creates the DNS record and
certificate on deploy (the flying-ant.uk zone is on the same account).
