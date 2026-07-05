## Context

Contact is the last unbuilt section. `page.tsx` currently renders only
`<Hero />` and `<Skills />` directly inside `<main>`, unwrapped (no
max-width container — a hard constraint carried over from Hero/About's
`position: fixed`/`absolute` hand-off, noted in `page.tsx`'s own comment).
Skills established the pattern this repo now uses for R3F scene
composition: a `<Canvas>` with a small controller component driving
per-frame transforms via `useFrame`, plus an `EffectComposer` for
postprocessing (`Bloom`, `ChromaticAberration` in Skills' case).

Two prior sections set relevant precedent:
- The About CRT scene already does continuous, non-scroll-driven animation
  (retrace band cycling, scanline drift) purely off an accumulated `uTime`
  uniform via each effect's `update(renderer, inputBuffer, deltaTime)`
  method — the same pattern this section's disk turbulence will reuse.
- Skills' `SkillsTextCard.tsx` established the visual language for a
  "floating info card" (rounded-2xl, `border-white/20`, `bg-black/60`,
  title separated from body by a `border-b` divider) — reused here, but
  without any of Skills' scroll-driven opacity/blur-ramp machinery, since
  this card has nothing to fade between.

The reference image for the black hole is a true gravitational-lensing
render (Interstellar-style): the accretion disk's far side appears bent
over both poles of the sphere, not just visible edge-on. Reproducing that
exactly requires ray-marching light paths through a curved-spacetime
approximation — a materially bigger and harder-to-tune effort than any
shader already in this repo (CRT and Skills' fisheye are both 2D
screen-space UV warps on an already-rendered frame, not a 3D lensing
simulation).

## Goals / Non-Goals

**Goals:**
- A black hole scene that reads as "the reference photo" at a glance —
  black event horizon, blown-out white-gold turbulent disk, a halo of
  light appearing to wrap over the top and bottom of the sphere — using
  techniques already proven in this codebase (self-illuminated shader
  materials, `useFrame`/`uTime`-driven continuous animation, `Bloom`).
- Contact section is a plain, normal-flow `min-h-screen` section — no
  scroll-jacking, no sticky pin, no phase state. The scene animates on its
  own clock regardless of scroll position.
- One static card: "CONTACT" title, divider, three real clickable links
  (LinkedIn, Telegram, Gmail) in a distinct blue link color. No animation
  of any kind on the card itself.
- Navbar hides once Contact is reached (third zone in its existing
  scroll-linked visibility state machine), reversing on scroll-back.
- Fully responsive: the 3D scene and the card both hold up from mobile to
  desktop widths.

**Non-Goals:**
- True gravitational lensing (ray-marched light bending). This is an
  approximation, not a physics simulation.
- Wiring the navbar's "Contact" nav item or the CRT menu's "CONTACT" button
  to scroll to this section. `scrollToSection`'s `"contact"` branch stays
  a no-op — that control is slated to open a popup later, not scroll here.
- A starfield background. The reference image is mostly a black void
  around the glow; a starfield would be a nice-to-have polish pass, not
  required for this change to read correctly.
- Any interaction with the black hole scene (pointer parallax, etc.) —
  it's a passive background, unlike Hero's star field or About's tilt.

## Decisions

### 1. Fake lensing via a black sphere + tilted disk + near-face-on halo ring
Three pieces, all sharing one emissive gradient shader driven by a single
`uTime` uniform:
- **Event horizon**: a plain `meshBasicMaterial` black sphere — needs no
  shader, it's already the darkest thing in the scene.
- **Accretion disk**: a flat ring (`RingGeometry` or a thin torus) tilted
  ~15-20° from edge-on, matching the reference photo's angle. Its material
  is a custom shader: radial gradient (white-hot near the inner edge →
  amber/orange toward the outer edge), angular brightness asymmetry (one
  side of the ring brighter than the other, aping relativistic beaming),
  and a scrolling noise/turbulence term for a "flowing gas" look.
- **Halo ring**: a second ring using the *same* shader/material, oriented
  much closer to face-on (nearly perpendicular to the tilted disk) and
  sized to hug the sphere's silhouette. Because it's opaque-sphere-occluded
  by normal depth testing, the near side of the halo naturally disappears
  behind the sphere while the far side reads as wrapping "over the top and
  bottom" — the classic non-lensing cheat for selling this look cheaply.

**Alternative considered**: a real ray-marched lensing shader (bend camera
rays around a mass, sample a background texture). Rejected for this
change — correct implementation requires solving/approximating geodesics
per-pixel, is expensive to tune visually, and the two-ring cheat gets
close to the reference image for a fraction of the effort. Flagged as a
possible future upgrade, not blocking this change.

### 2. Continuous, clock-driven animation — no scroll wiring at all
Unlike Skills (which needs `useSkillsScrollProgress` to know which of 3
logos is active), Contact has exactly one visual state. The disk shader's
turbulence offset and the halo/disk's slow rotation both advance from
`useFrame`'s `delta`, exactly like the About CRT effect's own `update()`
pattern. No `ScrollTrigger` touches the 3D scene at all.

**Alternative considered**: scroll-linked reveal (e.g., disk "spins up" as
you scroll into view). Rejected — adds a scroll-progress dependency for a
single-state scene with no payoff; "always animated" was explicit in the
brief.

### 3. Static card, reusing Skills' visual language without its animation plumbing
`ContactCard.tsx` is a plain functional component: centered via flex
layout (`absolute inset-0 flex items-center justify-center`, matching
`SkillsTextCard`'s pattern), `rounded-2xl border border-white/20 bg-black/60`
box, "CONTACT" as an `<h3>` with a `border-b` divider, then three lines of
label + link. No `cardRef`, no CSS custom property ramping, no
`getCardOpacity` — none of Skills' scroll-tied machinery applies since
there's nothing to fade between. A static `backdrop-blur-sm` class is
sufficient (no ramp needed, since the card is never transparent-then-solid
— it's just always solid).

Links: `text-blue-400 hover:text-blue-300 underline` (a clear "this is a
link" affordance, distinct from the label text). External links
(LinkedIn, Telegram) get `target="_blank" rel="noopener noreferrer"`;
Gmail is a `mailto:` link (no `target="_blank"` needed).

### 4. Navbar's third visibility zone, keyed to the Contact element (not a pixel constant)
Hero/Skills' navbar triggers (`TRIGGER_POINT`, `TRIGGER_POINT + LOCK_DISTANCE`)
are numeric pixel offsets because the Hero runway's height is a fixed
formula (`100vh + TRIGGER_POINT + LOCK_DISTANCE`). Skills' section height
(`600vh`) is also viewport-relative but doesn't need a *trigger point*
inside it — the navbar just stays dark for its entire duration. Contact,
being a plain `min-h-screen` section with no special height formula, has
no fixed-pixel document offset to hang a numeric `ScrollTrigger` on.
Instead, `Navbar.tsx` adds a third `ScrollTrigger` keyed to the Contact
section's own DOM element (`document.getElementById("contact-section")`,
`start: "top top"`), hiding the navbar via `onEnter` and reversing via
`onLeaveBack` — mirroring how Skills' own `id="skills-section"` lookup
works in `scrollNavigation.ts`, just applied to visibility instead of
scroll-jump targeting.

**Alternative considered**: computing Contact's document offset in JS and
reusing the existing numeric-`ScrollTrigger` pattern. Rejected — the
offset would depend on Skills' rendered height (`600vh` of a variable
viewport height) plus the Hero runway, both already runtime-computed
values; anchoring to the actual DOM element is simpler and self-correcting
if any upstream section's height changes.

### 5. Contact section stays outside a max-width wrapper
Same reasoning already documented in `page.tsx` for Hero/Skills: even
though Contact itself has no fixed/absolute positioning trick, keeping all
top-level sections structurally consistent (direct children of `<main>`,
unwrapped) avoids surprises if a future change ever needs to adjust
Skills' or About's positioning again.

## Risks / Trade-offs

- [Risk] The two-ring "fake lensing" cheat can look obviously wrong from
  certain camera angles or ring-size ratios (a visible seam where the halo
  ring's edge doesn't blend into the tilted disk). → Mitigation: tune
  ring sizes/opacity so they visually overlap and blend near the
  silhouette; this is a visual-tuning task expected during implementation,
  not a blocking unknown.
- [Risk] A strong `Bloom` pass tuned for this scene's much brighter core
  (vs. Skills' subtle glow) could bleed into/wash out the contact card if
  the card sits close to the bright disk on screen. → Mitigation: keep
  the card's background opaque enough (`bg-black/60` plus its own
  `backdrop-blur-sm`) and, if needed during implementation, position the
  disk/halo so the card doesn't sit directly over the brightest region.
- [Trade-off] Skipping true lensing means the illusion may not hold up
  under close scrutiny or on very wide/ultra-tall viewports where the
  halo-vs-disk blend ratio looks different. Accepted for this change per
  the proposal's non-goal; a real lensing shader is a possible later
  upgrade, not required now.

## Open Questions

- Exact tilt angle, ring radii, and color-ramp stops for the disk/halo are
  visual-tuning parameters, not architectural decisions — expected to be
  adjusted by eye once running in the browser, not finalized here.
- Whether to add a sparse starfield later is deferred (non-goal for this
  change).
