## Context

Skills (`app/components/Skills.tsx`) is currently a static placeholder
rendered as a normal-flow sibling of `<Hero>` in `page.tsx`, directly after
the Hero/About scroll runway. The three logo models already exist as typed
R3F components (`app/components/skills/models/{NextLogo,NestLogo,ThreeLogo}.tsx`)
with no built-in animation — they're dumb `useGLTF` mesh groups.

The site already has two scroll-driving precedents to build on:
- `useHeroScrollAnimation.ts`'s arrow-fill: a simple `scrub: true`
  `ScrollTrigger` mapping a fixed pixel range to a CSS `clipPath` value.
- The About raise/lock/release hand-off: explicitly *avoids* GSAP
  `ScrollTrigger` `pin: true` after hitting a real seam bug (a scrub tween
  trying to pixel-match native scroll on a `position: fixed` element lags a
  frame behind under fast wheel input). It solves pinning manually with a
  fixed→absolute flip at an exact scroll offset instead.

Navbar (`Navbar.tsx`) and the contact CTA (`WaveButton.tsx`) are both
hardcoded light-theme (white bg/black text, black border/wave fill). The
navbar's only visibility rule today lives in `useHeroScrollAnimation.ts`: a
single `ScrollTrigger` at `TRIGGER_POINT` with `toggleActions: "play none
none reverse"` that sets `.site-navbar` `yPercent: -100` forward, reversing
only if the user scrolls back above `TRIGGER_POINT`. There's no existing
"reappear later" mechanism.

Tailwind here has no dark-mode strategy configured (`globals.css`'s theme
block is entirely commented out) — so `dark:` variants aren't available for
free; theming has to be done via explicit prop-driven classes.

## Goals / Non-Goals

**Goals:**
- Build the real Skills scroll showcase: three sequential logo phases
  (Next.js → NestJS → Other/Three.js), each with slide+spin entry, a static
  hold with a centered text card, and an in-place hide on exit — fully
  scroll-scrubbed and reversible in both directions.
- Keep the stage visually pinned via native CSS `position: sticky`, not
  GSAP `pin: true`, consistent with the About section's seam-avoidance
  precedent.
- Add a reusable `theme: "light" | "dark"` prop to `Navbar` and
  `WaveButton` so the same components serve both Hero (light) and Skills
  (dark), and so a future site-wide dark mode has a component-level seam to
  hook into.
- Extend the navbar's scroll-linked visibility so it reappears (dark) once
  the user reaches Skills, and reverts to hidden→light correctly when
  scrolling back through About/Hero.

**Non-Goals:**
- Contact section and its own theming are out of scope (still not started).
- Final copy for the three descriptions is not required — placeholder/jest
  text is acceptable per the proposal.
- Tuning the exact scroll distance (`300vh` placeholder) to a final feel —
  flagged as adjustable after visual testing, not a blocking decision now.
- Mobile-specific performance tuning of the R3F canvas beyond what the
  existing CRT scene pattern already does (viewport-based scale clamping).
- Introducing a global Tailwind dark-mode strategy (`dark:` variants,
  `prefers-color-scheme` wiring) — only the two components in scope get a
  theme prop.

## Decisions

### 1. Sticky stage, not `ScrollTrigger.pin`
The Skills `<section>` becomes tall (`h-[300vh]`, matching the proposal's
tunable placeholder) containing an inner wrapper:
`className="sticky top-0 h-screen overflow-hidden"`. This wrapper holds the
R3F `<Canvas>`, the background glow layer, and the text card. Because
`position: sticky` is native browser layout (not JS reacting to scroll
events a frame late), it can't reproduce the fixed-vs-native-scroll seam
that forced the About section's manual fixed→absolute hand-off. A single
`ScrollTrigger` with `scrub: true`, `trigger: <the tall section>`,
`start: "top top"`, `end: "bottom bottom"` yields a 0→1 progress value for
the whole showcase; no pinning duty falls on GSAP at all.

**Alternative considered**: `ScrollTrigger.pin`. Rejected — same seam risk
already documented in `useHeroScrollAnimation.ts`'s comments, and sticky
achieves the identical visual result with zero extra JS scroll-fighting.

### 2. Progress → phase mapping as a single scrub timeline with three equal thirds
`progress ∈ [0, 1)` maps to phase `Math.floor(progress * 3)` (0 = Next, 1 =
Nest, 2 = Other), with `localProgress = (progress * 3) % 1` driving that
phase's own enter→hold→exit curve (e.g. enter over `[0, 0.35)`, hold over
`[0.35, 0.65)`, exit over `[0.65, 1)`). This is computed per-frame from the
single scrub value (no discrete GSAP timelines per phase, no risk of
timelines drifting out of sync with scroll) — a plain function of
`scrollProgress`, matching "just a scroll" / fully-reversible-at-any-point
from the brief.

**Alternative considered**: three separate `ScrollTrigger`s, one per logo,
each with its own `start`/`end` pixel range. Rejected as unnecessary
duplication — a single progress value with derived phase/local-progress is
simpler to keep reversible and avoids three sets of trigger math to keep in
sync with the section's total height.

### 3. Logo motion: transform-only, driven by local progress
Each logo is an R3F `<group>` whose `position.x` and `rotation.y` (the
"spin") are set directly from `localProgress` inside the shared scroll hook
(no per-logo internal animation state) — e.g. enter phase interpolates
`position.x` from an off-stage value (left or right, per the logo's fixed
direction) to 0 while `rotation.y` spins through some multiple of `Math.PI`;
hold phase pins both at rest; exit phase continues the same directional
motion to hide the logo (translating further in the same direction, per the
brief's "goes right to left and just hides in place" — i.e. it doesn't need
to reverse or bounce, it continues off).

Directions are a fixed per-logo constant, no alternation logic:
Next.js = left→right, NestJS = right→left, Other/Three.js = left→right.

### 4. Text card: static position, content-only swap, no motion of its own
The card is centered via normal flex/grid centering inside the sticky
wrapper (not `position: fixed`) so it re-centers correctly across viewport
sizes without extra breakpoint logic. It renders content only while the
active phase is in its "hold" window; outside hold windows it renders
empty/hidden (per "in mid-animation of each logo should be normal window
with text" — content is tied to the hold state, not to the whole phase).
No GSAP tween touches the card — content swapping is a plain conditional
render driven by the same `phase`/`localProgress` values, so there is
nothing to reverse-animate (matches "shouldn't have any animation, just
smooth scroll").

### 5. Background glow: interpolated color, not a hard cut
The glow (a CSS radial-gradient layer or absolutely-positioned blurred div
behind the canvas) crossfades between white and NestJS's red-pink using the
same `progress` value, so the color transition lands mid-way between
adjacent phases rather than popping at the phase boundary — avoids a jarring
color snap exactly when a logo is still visible.

### 6. Component theming: explicit `theme` prop, not Tailwind `dark:` variants
Since no dark-mode Tailwind strategy is configured, `Navbar` and
`WaveButton` each take a `theme: "light" | "dark"` prop (default `"light"`)
and select between two explicit class strings (e.g. light: `bg-white
text-black border-black`; dark: `bg-black/80 text-white border-white`)
rather than introducing `dark:` variants that would require a global
Tailwind config change out of scope here. `page.tsx` (or a small wrapper)
determines which theme to pass based on scroll position.

**Alternative considered**: two separate components (`NavbarDark`,
`WaveButtonDark`). Rejected — duplicates the wave-fill animation logic and
link list, and drifts the moment one copy is edited without the other;
explicitly against the proposal's intent to make dark theme reusable for a
later site-wide pass.

### 7. Navbar visibility state machine gains a third zone
Today: `scrollY < TRIGGER_POINT` → visible (light); `scrollY >=
TRIGGER_POINT` → hidden (forever, until scrolling back). This change adds a
second `ScrollTrigger` keyed to the Skills section's own start (i.e. the
existing `releasePoint = TRIGGER_POINT + LOCK_DISTANCE`, where About's
fixed→absolute flip already happens and Skills' top edge lines up exactly):
`scrollY >= releasePoint` → visible again, dark theme. Reversing back below
`releasePoint` (but still above `TRIGGER_POINT`) returns to hidden;
reversing back below `TRIGGER_POINT` returns to visible/light. Net state
machine:

```
scrollY:     0 ─────── TRIGGER_POINT ─────── releasePoint ─────→
navbar:    visible          hidden               visible
theme:      light             —                    dark
```

Implemented as two independent `ScrollTrigger`s (reusing the existing one
for the hide, adding one for the dark re-show) rather than one large custom
state machine, since each trigger's `toggleActions` already expresses
exactly one boundary crossing.

## Risks / Trade-offs

- [Risk] Three.js canvas inside a `position: sticky` container on mobile
  Safari has known quirks with sticky recalculation during scroll momentum.
  → Mitigation: test explicitly on a mobile viewport during implementation;
  fall back to a plain `position: fixed` measured against the section's own
  bounding box if sticky proves unreliable there (documented as an open
  question below, not decided now).
- [Risk] A single derived-progress function (Decision 2) means a bug in the
  phase-boundary math affects all three logos identically, vs. isolated
  per-logo triggers. → Mitigation: the phase math is a pure function
  (`progress → {phase, localProgress}`), straightforward to unit-reason
  about and to tune later without touching animation code.
  Should be manually tested by scrolling this specific section slowly in both directions, checking for glitches.
- [Risk] Two independent `ScrollTrigger`s for navbar hide/re-show
  (Decision 7) could momentarily disagree if `releasePoint` and
  `TRIGGER_POINT` math ever drift apart from the About section's own
  geometry constants. → Mitigation: both triggers already import
  `TRIGGER_POINT`/`LOCK_DISTANCE` from the single source of truth in
  `useHeroScrollAnimation.ts`; no new constants introduced.
- [Trade-off] Adding ~`300vh` of scroll length increases total page scroll
  distance noticeably. Explicitly accepted as tunable-later per the
  proposal, not solved here.

## Open Questions

- Does `position: sticky` behave acceptably on mobile Safari for this
  section, or does it need the fixed-position fallback mentioned above?
  Resolve during implementation via real-device or BrowserStack-style
  testing.
- Exact enter/hold/exit split (currently 35/30/35 of each phase third) is a
  starting point, not a final number — expected to be tuned visually once
  running in the browser.
