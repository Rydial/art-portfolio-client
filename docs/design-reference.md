# Art Portfolio — Client Design Reference (v4)

Solo project, three separate repos: `client` (public), `server` (private),
`admin` (private). This doc covers the **client** repo's design decisions
only. Code context will be provided separately.

## Tech stack (client)

- React + TypeScript + Vite
- Zustand (state)
- SASS — CSS Modules per component + a global SASS system for shared
  tokens/mixins
- Motion (formerly Framer Motion) for animation

## Overall concept: "The Collector's Home"

The whole site is framed as walking through a lived-in home. Not a generic
portfolio grid — spatial, narrative, room-based. Three pages: Home, Gallery,
Artwork.

## Pages

### Home Page — "The Entryway"

A single framed artwork above a credenza. The credenza is deliberately
**wider than the frame** — a real console spans wider than the single piece
hanging above it — and doubles as a staging surface for small objects, some
purely decorative and some functional.

- **Slideshow**: artworks are selected by featured tag first, falling back to
  the most recent pieces if the featured pool is thin. Autoplay with
  crossfade, pause on hover/focus, and a brief "moment" (a glint/shadow
  shift) on each transition rather than a flat crossfade.
- **Exit transition (Home → Gallery)**: unchanged from the original concept.
  Clicking the frame animates it as one continuous shared-element transition
  toward its actual resting position on the Gallery wall — not to a fixed
  center point. The home scene fades/blurs out mid-flight while the gallery
  scene fades in underneath.

See **Home scene layout principles**, **Objects on the credenza**, and **The
credenza itself** below for the design rules governing this page in detail.

### Gallery Page — "The Hallway"

- One continuous hallway, pannable/scrollable. Rooms are arranged
  sequentially along it, one filling the screen at a time as you pan
  between them — this is **not** a corridor you see down with rooms
  branching perpendicular off to the side (that's a further-out
  possibility, not what's being built now). Continuity between rooms
  instead comes from the hallway's wall and floor material running
  unbroken behind and beneath the rooms — see **Room structure** below —
  so moving between rooms doesn't feel like a hard cut between unrelated
  screens, even though only one room is the focus at a time. Resizing the
  window while inside a room shouldn't change which room is currently in
  view — the room you're looking at stays the one you're looking at, even
  as its own size adjusts to the new window dimensions.
- Visitors from Home arrive already inside the room of the artwork they
  clicked — not at the start of the hallway.
- Rooms are **data-driven**, derived from whichever categories actually exist
  in the collection — not hardcoded to the three known today (Landscape,
  Portrait, Still life).
- A room never attempts to display its entire category at once. Instead,
  each room shows a small, capped selection of its artworks — enough to
  feel populated, never so many that pieces have to shrink past the point
  of reading as real objects. Because every room now displays somewhere
  within that same small range regardless of its category's true size,
  every room can share one composition approach instead of branching
  between a "sparse" and a "dense" treatment.
- Within that capped selection, a room's artworks are arranged in
  positions that are randomized but stable — the arrangement never
  reshuffles on its own (e.g. leaving the page and coming back finds the
  same layout), only changing if the selection itself changes. Every
  artwork keeps its own true aspect ratio — nothing is stretched or
  cropped to force a uniform shape. The whole group is packed together and
  scaled as one unit to fill the room without any pieces overlapping: a
  room with a single piece can show it large, as a deliberate, emphasized
  "anchor" placement, while a fuller room scales everything down together
  so nothing spills past its neighbors. Because the group scales together
  rather than each piece scaling independently, a piece that's naturally
  larger than its neighbors stays proportionally larger, instead of every
  piece being forced to the same size. Only the artwork's image area
  changes size this way — the frame and matting around each piece stay a
  constant physical thickness regardless of how much the image itself has
  been scaled up or down, so a room's framing always reads as the same
  weight of construction whether it's showing one piece or several.
- **Collections**: since a room only ever shows a handful of pieces, each
  room needs to decide _which_ handful. A room displays one of a small
  set of named collections at a time — "Most recent" (the default),
  "Featured" (only offered in a room if it actually has a featured piece
  in it), and one special case, "Nearest to your pick" (see below). A
  collection is never offered as a choice in a room unless there's
  genuinely at least one artwork behind it — no fallback options. Every
  room tracks its own active collection independently of every other
  room.
- **Nearest to your pick** exists only in the one room containing the
  artwork a visitor actually clicked on Home, and only that room opens on
  it by default (every other room — and every room, if there was no
  click-through at all — opens on "Most recent"). It's built outward from
  the clicked artwork by date, both earlier and later, so a visitor who
  followed a piece in from Home can always find their way back to it. If
  the visitor manually switches that room to a different collection and
  the original piece isn't part of it, it's fine for it to simply
  disappear from view — it doesn't need to be pinned in place regardless
  of collection.
- The collection picker lives on the room's own plaque/label (see Room
  structure below), reading as "what's currently on display here" rather
  than a search form. It's deliberately a single, simple choice — not a
  system like Directory's independent multi-filter combination, since a
  room's role is a curated glimpse, not an exhaustive search.
- **Room structure**: a room is made of layers with different jobs.
  - The **doorway** — the room's threshold, holding its artwork
    composition and its plaque/label together — follows the same
    "always fully visible, never cropped" guarantee Home's frame has,
    extended to the whole room: the doorway's contents scale together as
    one unit, shrinking together on small screens down to a legibility
    floor, and never growing past their natural size on generous ones —
    the same mechanic as Home's frame-and-credenza composition.
  - The **wall and floor**, by contrast, belong to the hallway itself,
    not to any individual room. They run continuously behind and beneath
    every doorway, connecting one room to the next, and don't scale with
    any individual room's doorway. Because the visual gap between
    doorways can vary — especially once doorways are shrunk to different
    degrees on a small screen — the wall and floor need to be able to
    extend to whatever length is needed without looking stretched or
    distorted. The intended approach is a small, repeating (tileable)
    material rather than a single resizable image, so any length is just
    "more or fewer repeats" of the same tile.
  - For now, every room's wall looks identical. Giving each room's wall
    its own material or tone (e.g., something warmer for the still-life
    room) is a reasonable future extension once per-room wall styling is
    wanted, but isn't part of the current plan.
  - The doorway is currently **open** — there's no literal door frame or
    aperture yet. The wall-and-floor structure is intentionally the
    first step toward a real doorway later: extending the walls inward
    to form an actual framed opening is meant to be a natural
    continuation of this structure, not a rebuild of it.
  - Exact dimensions, tile assets, and HTML/element structure for this
    system are deliberately left conceptual for now, to be settled once
    implementation resumes.
- **Two modes**: Walkthrough (the cinematic, room-by-room experience
  described above, and the default) and Directory (a flat, fast,
  filterable list/grid — the practical, exhaustive backbone for search,
  mobile, and accessibility). Directory is the counterpart to
  Walkthrough's curated/capped approach: Directory always shows every
  artwork, filterable across every combination of its filters at once,
  with no cap.
- Toggling between modes dims/blurs the spatial scene, then the Directory's
  content fades/rises in to fully replace it. Directory's resting state is a
  full, spacious view, not a small floating panel.
- Filters (Directory only): category, medium (kept even though currently
  always "oil painting," for future-proofing), size, year, and possibly
  palette/tone as a nice-to-have. No price/availability filter — portfolio
  only, for now.

### Artwork Page — "Spotlighted View"

Unchanged from the original concept, and still mostly undesigned in detail.

- Artwork steps forward into a large, centered, focused presentation with a
  museum-style plaque: title, medium, category, year, dimensions.
- Description is optional per artwork; the plaque layout should collapse
  gracefully when it's absent, with no placeholder text or empty gap.
- **Two entrance treatments** depending on how the visitor arrived: from a
  room (the background stays visible but blurred/soft-focused behind the
  piece, reinforcing "you stepped closer"), or from Directory/search/a direct
  link (a full-bleed neutral backdrop, no fake room context).
- In-room next/prev arrows to move between pieces in the same room without
  backing out to the hallway.
- Exit reverses whichever entrance transition played.
- Each artwork needs its own real, shareable route for deep-linking, which is
  also what triggers the full-bleed fallback treatment on a cold load.

## Navigation system

Two persistent, small-but-always-visible buttons living above the animated
scenes, unaffected by whatever transition is playing underneath:

- **Home** (top-left) — visible on Gallery and Artwork, hidden on Home
  itself.
- **Directory toggle** (top-right) — visible only on Gallery. Its label and
  icon should reflect the mode you'd switch _to_, not the current mode, so it
  reads as an action rather than a status indicator.
- **Home's exit transition** deliberately does not attempt to reverse the
  exact spatial path taken to get there (this breaks down from deep states
  like an Artwork page reached via Directory, which has no "room" to fly back
  through) — one consistent, simple fade/blur-through transition is used
  regardless of origin.
- Both buttons should be small and unobtrusive but never hover-to-reveal —
  this is the one true "escape hatch" on the site, and usability wins over
  strict immersion here.
- The Directory toggle's button should hold a consistent size regardless of
  which of its two labels is currently showing — it shouldn't visibly resize
  every time the label flips between "Directory" and "Walkthrough."

**Icon direction** (settled):

- Home: a simple threshold/doorway glyph.
- Directory: a plain 2×2 grid of squares — flat and practical-looking,
  deliberately the least "architectural" glyph of the set, since Directory
  mode is the un-cinematic, get-things-done view.
- Walkthrough: a hallway rendered in perspective — a shape narrowing toward a
  vanishing point — tying to "The Hallway" concept rather than reusing Home's
  doorway glyph.
- All three are simple outlined line-art rather than solid/filled shapes, to
  feel like a light brass inlay rather than a heavy app icon. Idle state
  should read as slightly dim/in-shadow; hovering should brighten it, like
  catching light; pressing it should dip duller and smaller, like being
  pushed back into shadow rather than simply "un-hovering."

## Framed artwork construction

Every framed artwork on the site — Home's single piece above the credenza,
and every artwork hung in a Gallery room — is built from the same three
layers, in the same order: an outer **frame** (walnut wood), an inner
**matting** board (parchment) sitting between the frame and the image, and
the image itself. This is a site-wide construction, not page-specific
styling — a piece should read as the same physical object regardless of
which page it's shown on, which matters especially for the Home → Gallery
exit transition, where the clicked piece is meant to visually continue as
the same object rather than switching construction mid-flight.

## Data model implications

Each artwork includes:

- `title`
- `category` (landscape / portrait / still life — extensible; the Gallery's
  room list is derived from whichever categories are actually present, never
  hardcoded)
- `medium` (currently always "oil painting," but a real field, not a
  constant — future-proofing for when a second medium exists)
- `year`
- `dimensions`
- `description` (optional/nullable)
- `featured` — used both for Home's slideshow selection and as the basis
  for a Gallery room's "Featured" collection
- `date added` — used for Home's fallback sort, Directory's default sort,
  and Gallery's "Most recent"/"Nearest to your pick" room collections
- a manual hang-order or similar, for room/wall position — likely
  auto-generated rather than manually placed per piece, since a room's
  artwork arrangement is randomized/algorithmic within its capped
  selection, not manually curated per piece
- its own slug/route, for deep linking

No price/availability field is exposed yet (portfolio only, for now), but the
shape should stay open to adding one later without a schema overhaul.

---

## Home scene layout principles

The frame's visibility is **non-negotiable**: it must never be cropped or
pushed off-screen, on any window size or aspect ratio. The credenza is held
to a looser standard, since it's staging furniture rather than the artwork
itself — it's allowed to be visually cropped at the bottom, and at the sides,
on small or unusually-shaped screens. This is an intentional asymmetry, not
an oversight: the frame is the priority; the credenza is not.

A few consequences that follow from that asymmetry:

- **Every object placed on the credenza must remain fully visible whenever
  the frame is.** An object should never disappear or get clipped while the
  frame above it stays intact — the "always visible" guarantee covers the
  frame _and_ the full spread of whatever's sitting on the credenza, not the
  credenza's full width or height.
- **On very small or short screens**, rather than reflowing the layout
  piece-by-piece, the whole composition — frame, the gap above the credenza,
  the credenza, and every object on it — shrinks together, proportionally, as
  one unit. It shrinks only as far as necessary to guarantee the frame and
  its objects still fit; beyond that point, it's the credenza's excess size
  (whatever's beyond what the frame and objects actually need) that gets
  cropped, rather than shrinking the whole scene further.
- **On generously tall or wide screens**, nothing needs to shrink at all —
  the composition renders at its natural size, and the credenza's extra width
  simply is what it is, extending toward the edges of the screen if there's
  room, or getting cropped at the edges if there isn't, without ever
  affecting the frame.
- **On tall, narrow screens** (a phone held upright), there's typically
  enough vertical room that nothing needs to crop at all — the full credenza,
  frame, and every object should all be comfortably visible together.
- **On short, wide screens** (a phone held sideways, or a short browser
  window), vertical room is scarce — the frame stays protected under the rule
  above, while the lower portion of the credenza is allowed to run off the
  bottom of the screen.

This same "shrink the whole composition as one unit down to a floor, then
let the non-essential parts absorb any further shrinkage or excess space"
principle is reused for the Gallery's rooms — see **Room structure** under
the Gallery Page section above.

## Objects on the credenza

Objects are illustrated in the same flat, vector style as the rest of the
scene (the nav icons, the ambient details) rather than photographed. This is
a deliberate, current-stage choice: vector artwork stays easy to recolor,
restyle, or make interactive without needing new photography every time
something changes, which matters more right now than achieving
photorealism — the priority at this stage is getting the layout and
interactions right, with illustration polish to follow. This may be
revisited later, once the layout has settled.

Design rules for any object placed on the credenza, regardless of what it is:

- **Consistent light.** Every object should look lit from the same direction
  and cast a shadow the same way, so a growing collection of objects — added
  at different times, possibly by different people — still reads as
  belonging to one coherent scene rather than a mismatched collage.
- **A soft contact shadow** where the object meets the credenza's surface, in
  addition to its own cast shadow — this is what makes an object read as
  _resting on_ the surface rather than floating just above it.
- **Anchored at the base, not the top.** An object should visually grow
  upward from the point where it touches the surface, the way a real object
  would — not hang downward from a placement point above it. This matters
  more as objects of different heights get added over time.
- **Some objects are decorative, some are functional.** The clock is the
  first functional one; more of both kinds are expected later.

A soft fade-to-background treatment was tried at the credenza's cropped
bottom edge, to keep a hard crop from looking accidental. It didn't hold up
visually and was dropped — the cropped edge is currently just a plain, clean
cut instead. Worth remembering if a similar "soften the crop" idea comes up
again: it's already been tried once.

## The credenza itself

Rendered as furniture seen **straight-on** — a front face viewed dead-on,
plus a visible top surface catching light from above — rather than a flat,
single-toned rectangle. The top surface is a symmetric trapezoid that
recedes evenly from both edges toward the back, rather than sliding
sideways toward one edge — this is what gives it a "looking down at the
surface" three-dimensional read without introducing any left/right skew.
There's deliberately no visible side face: a true front-on view wouldn't
show one, since a side face is only ever visible from an off-axis camera
angle. (An earlier version rendered this as a three-quarter/oblique angle
with a visible receding side face — that's been corrected in favor of the
straight-on treatment described here.)

- **Cropped to its top portion only** — no legs, no floor beneath it. This is
  a deliberate composition, not a placeholder: it matches how real furniture
  or tabletop product photography is often cropped for a "styling vignette"
  shot, and it frees up vertical space now that the credenza's job is a
  staging surface for objects rather than full environmental furniture.
- **Material should feel textured, not flat** — a subtle wood-grain quality
  across the surface, rather than a smooth gradient alone. A hard edge (like
  where the top surface meets the front face) should show both a highlight
  _and_ an adjacent shadow, the way a real edge catching light does — most
  flat illustration only bothers with the highlight half of that pairing.
- Brass hardware (drawer pulls) should carry a small highlight to read as
  metal rather than flat color.
- **Long-term direction, explicitly deferred:** using a real, photographic
  cutout for the credenza instead of an illustration was considered and set
  aside for now, in favor of staying vector while layout and interaction are
  still being worked out (see "Objects on the credenza" above for the
  reasoning). Worth revisiting once the layout is stable and illustration
  polish becomes the priority — but not before.

---

## Open / not yet decided

1. **Visual language for the frame** — still undecided whether it eventually
   follows the credenza toward a more photographic treatment, or stays in the
   same illustrated style it's in now. Whichever direction is chosen, it
   should stay consistent with wherever the credenza ends up, since both read
   as "furniture" in the scene — even though the nav icons/chrome are a
   separate layer and are fine staying illustrated regardless of what the
   furniture does.
2. **Illustration quality of the objects on the credenza** — the clock is
   currently a deliberately simple placeholder, not a finished illustration.
   A proper illustration pass is expected once layout and interaction are
   settled.
3. **Additional objects for the credenza** beyond the clock haven't been
   designed yet. Whatever gets added needs to respect the "always fully
   visible alongside the frame" rule above.
4. **How much of the credenza is allowed to crop, and how much breathing room
   sits above it**, are current best guesses rather than something validated
   by actually looking at it across a range of real devices — worth
   revisiting once it's been seen.
5. **A literal doorway aperture for Gallery rooms** — currently each room is
   simply open, with wall material at its sides. The wall structure is meant
   to extend into a real framed opening later; that extension hasn't been
   designed yet.
6. **Per-room wall/material styling in Gallery** — every room's wall
   currently looks identical. Giving individual rooms their own wall tone or
   material is a reasonable future direction, not yet pursued.
7. **Exact dimensions, tile assets, and structure for the Gallery's
   doorway/wall/floor system** — deliberately left conceptual for now, to be
   settled once implementation resumes.
8. **The Artwork page** is still largely conceptual, and undesigned in
   detail beyond what's captured above — the museum plaque, the two entrance
   treatments, and in-room navigation all still need real design work. Its
   interaction with Gallery rooms (e.g. clicking through from a room's
   artwork) also isn't wired up in the implementation yet, since the page
   doesn't exist.
9. **Data model / server contract** — still informal, as in the original
   doc.
10. **Desktop input for panning the hallway** — touch swiping and trackpad
    two-finger scrolling both work naturally. A plain mouse with only a
    vertical scroll wheel currently has no way to move between rooms at
    all. Whether the fix is treating mouse-wheel input as pan input,
    adding a persistent set of prev/next room controls (distinct from the
    Artwork page's in-room prev/next arrows, which move between pieces
    _within_ a room rather than between rooms), enabling keyboard
    arrow-key panning, or some combination of these, hasn't been decided.
