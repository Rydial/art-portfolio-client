# Art Portfolio — Client Design Reference (v2)

Solo project, three separate repos: `client` (public), `server` (private),
`admin` (private). This doc covers the **client** repo's design decisions
only. Code context will be provided separately.

This supersedes the original design-only reference. A number of decisions
below were made while building the Home page and are now considered settled;
everything else from the original doc still stands unless noted.

## Tech stack (client)

- React + TypeScript + Vite
- Zustand (state)
- SASS — CSS Modules per component + a global SASS system for shared
  tokens/mixins
- Motion (formerly Framer Motion) for animation
- A path alias is configured so shared modules can be imported cleanly from
  anywhere in the project

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
- The plaque (title/medium/year) and manual prev/next controls originally
  planned for the frame have been **removed**. The credenza and its objects
  are now the layer carrying visual interest and interactivity — the frame
  itself stays quiet.
- **Exit transition (Home → Gallery)**: unchanged from the original concept.
  Clicking the frame animates it as one continuous shared-element transition
  toward its actual resting position on the Gallery wall — not to a fixed
  center point. The home scene fades/blurs out mid-flight while the gallery
  scene fades in underneath.

See **Home scene layout principles**, **Objects on the credenza**, and **The
credenza itself** below for the design rules governing this page in detail.

### Gallery Page — "The Hallway"

Unchanged from the original concept.

- One continuous hallway, pannable/scrollable, with rooms as doorways
  branching off it.
- Visitors from Home arrive already inside the room of the artwork they
  clicked — not at the start of the hallway.
- Rooms are **data-driven**, derived from whichever categories actually exist
  in the collection — not hardcoded to the three known today (Landscape,
  Portrait, Still life).
- Room layout scales with an unknown, growing piece count: sparse rooms get
  generous gallery-style spacing with a possible single "anchor" piece; dense
  rooms get a salon-style hang with varied frame sizes across multiple rows.
- **Two modes**: Walkthrough (the cinematic, spatial pan-through-rooms
  experience, and the default) and Directory (a flat, fast, filterable
  list/grid — the practical backbone for search, mobile, and accessibility).
- Toggling between modes dims/blurs the spatial scene, then the Directory's
  content fades/rises in to fully replace it. Directory's resting state is a
  full, spacious view, not a small floating panel.
- Filters: category, medium (kept even though currently always "oil
  painting," for future-proofing), size, year, and possibly palette/tone as a
  nice-to-have. No price/availability filter — portfolio only, for now.

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
- `featured` (for Home slideshow selection)
- `date added` (for Home's fallback sort and Directory's default sort)
- a manual hang-order or similar, for room/wall position — likely
  auto-generated rather than manually placed per piece, since room layout is
  algorithmic based on density
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

Rendered as furniture seen at a slight three-quarter angle — a front face, a
visible sliver of the top surface catching light from above, and a visible
sliver of the side face receding into shadow — rather than a flat,
single-toned rectangle. This is what actually reads as three-dimensional: the
eye resolves depth from seeing multiple differently-lit surfaces of one
object, not from shading alone on a flat shape.

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
4. **Gallery and Artwork pages** are still largely conceptual — the room
   list being data-driven is the only piece of that concept that's been
   carried into anything concrete so far. The museum plaque, the two entrance
   treatments, and in-room navigation are still undesigned in detail.
5. **How much of the credenza is allowed to crop, and how much breathing room
   sits above it**, are current best guesses rather than something validated
   by actually looking at it across a range of real devices — worth
   revisiting once it's been seen.
6. **Data model / server contract** — still informal, as in the original
   doc.
