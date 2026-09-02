# Art Portfolio — Client Design Reference

Solo project, three separate repos: `client` (public), `server` (private), `admin` (private).
This doc covers the **client** repo's design decisions only, made before any code was written.

## Tech stack (client)

- React + TypeScript + Vite
- Zustand (state)
- SASS — CSS Modules per component (`Component.module.scss`) + a global SASS system (abstracts/base) for shared tokens/mixins
- Motion (formerly Framer Motion) — imported from `"motion/react"`
- Vite `additionalData` config auto-injects global SASS variables/mixins into every module; `@/` path alias configured in both `vite.config.ts` and `tsconfig.json`

## Overall concept: "The Collector's Home"

The whole site is framed as walking through a lived-in home. Not a generic portfolio grid — spatial, narrative, room-based. Three pages: Home, Gallery, Artwork.

## Pages

### Home Page — "The Entryway"
- Single framed artwork mounted above a credenza (not a cluster — keeps it intimate, avoids decision paralysis, lighter first paint).
- Slideshow of artworks selected by: **featured tag first, falls back to most recent** if the featured pool is empty/thin. Admin side will need a manual "feature on home" toggle per artwork, likely with a cap on how many show.
- Ambient "lived-in" details: subtle light drift, maybe slight parallax on scroll/mouse-move, gentle idle motion (plant sway, dust motes) — nothing competing with the art.
- Slideshow behavior: autoplay with crossfade, pause on hover/focus, subtle manual prev/next, a small "moment" on transition (glint/shadow shift) rather than a flat crossfade.
- **Exit transition (Home → Gallery)**: clicking the framed artwork does NOT center it in a fixed spot. Instead, using Motion's `layoutId`, the frame animates toward its *actual* resting position in its assigned room/wall in the Gallery. The home scene (credenza, walls) fades/blurs out mid-flight while the gallery scene fades in underneath — one continuous shared-element transition, not two stitched fades. The frame's destination is dynamic per-artwork based on room assignment.

### Gallery Page — "The Hallway"
- One continuous hallway, pannable/scrollable, with rooms as doorways branching off it.
- Visitors from Home arrive already inside the room of the artwork they clicked — not at the start of the hallway. Exploring further rooms is optional.
- Doorways act as soft snap-points when panning near them.
- **Rooms are data-driven, not hardcoded** — the hallway renders N doorways based on however many categories exist in the data. Currently 3 rooms:
  - **Landscape** → Sunroom/garden-style room (natural light, plants)
  - **Portrait** → Parlor/study (intimate, warmer light)
  - **Still life** → Dining room
- Medium is currently constant (all oil painting), so rooms are organized by **subject/category**, not medium — matches how a real collector organizes a home.
- **Room layout must scale with an unknown, growing piece count**:
  - Sparse rooms (few pieces): generous gallery-style spacing, possibly one larger "anchor" piece.
  - Dense rooms (many pieces): salon-style hang, varied frame sizes, multiple rows.
  - Each room is its own scrollable/pannable segment — grows "deeper," not redesigned, as the collection scales.
- **Two gallery modes**:
  1. **Walkthrough mode** — the cinematic spatial pan-through-rooms experience. The default/flagship mode.
  2. **Directory mode** — a flat, fast, filterable list/grid of every artwork. Practical backbone for search/filter, mobile, accessibility, and browsing a large collection quickly. This is where filter/search controls live.
- **Filters/facets**: category (landscape/portrait/still life, extensible), medium (kept even though currently always "oil painting" — future-proofing), size, year, possibly palette/tone (warm/cool/monochrome) as a nice-to-have. No price/availability facet (see Artwork Page section — portfolio only for now).
- **Mode switch transition**: toggling Walkthrough ⇄ Directory dims/blurs the spatial scene, then Directory's content (grid + filter bar) fades/rises in to fully replace it — overlay-*style transition*, but Directory's resting state is a full, spacious view (not a small floating panel), since it needs to support real search/filter content.

### Artwork Page — "Spotlighted View"
- Artwork steps forward into a large, centered, focused presentation with a museum-style plaque: title, medium, category, year, dimensions.
- **Description field**: optional per artwork (nullable). Plaque layout collapses gracefully when absent — no placeholder text, no empty gap.
- **No pricing/availability** — portfolio only for now. Data model should stay loosely open to adding an `availability` field later without a schema overhaul, but nothing to build now.
- **Two entrance treatments** depending on how the visitor arrived:
  - From a room (spatial click): background stays anchored — room visible but blurred/soft-focused behind the piece. Reinforces "you stepped closer."
  - From Directory mode, search, or a direct/shared link (no spatial origin): full-bleed neutral backdrop, no fake room context.
- **In-room navigation**: next/prev arrows to move to other pieces in the same room without backing out to the hallway first.
- **Exit**: reverses whichever entrance transition played — flies back to wall position (spatial entries) or fades out (non-spatial entries), landing back at the same scroll/room state.
- **Each artwork needs its own real route/URL** — not just client-side state — for shareability, browser back-button support, SEO, and cold-load deep links (which is the case that triggers the full-bleed fallback treatment).

## Navigation system

- Two persistent overlay buttons living in a fixed "chrome" layer above the animated scenes (unaffected by scene transitions):
  - **Home button** — top-left corner. Visible on Gallery (both modes) and Artwork page. Hidden on Home page itself.
  - **Directory toggle** — top-right corner. Visible only on the Gallery page (both modes). Hidden on Home and Artwork. Icon/label should reflect the mode you'd switch *to*, not the current mode (so it reads as an action).
- **Home button transition**: does NOT attempt to reverse the exact spatial path taken to get there (this breaks down/gets complex from deep states like Artwork-via-Directory, which has no "room" to fly back through). Instead uses one consistent, simple soft fade/blur-through transition regardless of origin.
- Both buttons are meant to be small/unobtrusive but always visible (not hover-to-reveal) — usability over strict immersion for the one true "escape hatch" on the site.

## Data model implications (not yet formalized — surfaced from page/nav requirements)

Each artwork will likely need:
- `title`
- `category` (landscape / portrait / still life — extensible)
- `medium` (currently always "oil painting," kept as a real field not a constant)
- `year`
- `dimensions`
- `description` (optional/nullable)
- `featured` (boolean, for Home slideshow selection)
- `dateAdded` (for Home's fallback sort and Directory's default sort)
- Room/wall position data — likely auto-generated (sort order or a manual `order` field) rather than manually placed per piece, since room layout is algorithmic based on density
- Own slug/route for deep linking

Room list itself should be data-driven (derived from distinct categories present), not hardcoded to 3.

## Open / not yet decided

1. **Visual language** — palette, typography, lighting mood, materials (wood tones, wall colors, frame style), and whether nav chrome elements should look like in-scene objects (lightswitch, doorframe) vs. conventional floating UI — still to be decided.
2. **Data model** — the above is inferred from requirements, not yet formally schema'd (types, admin/server contract, etc.).
3. **No code has been written yet** for any of the three pages — this doc is pure concept/design, ready to move into scaffolding.
