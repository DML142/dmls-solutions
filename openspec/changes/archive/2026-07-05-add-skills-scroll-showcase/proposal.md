## Why

The Skills section is currently a placeholder (fullscreen black div with a
static "SKILLS" heading). The three optimized 3D logo models (Next.js,
NestJS, Three.js) and their typed R3F components are already built and ready
to use, but nothing composes them into an actual scene. This change builds
the real Skills experience: a scroll-driven showcase that cycles through the
three logos with matching background glow and description text, plus a
site-wide light/dark navbar theme so the navbar can reappear (in dark mode)
once Skills comes into view instead of staying hidden for the rest of the
page.

## What Changes

- Replace the Skills placeholder with a scroll-scrubbed showcase: a tall
  (~300vh, tunable) section containing a `position: sticky` stage that stays
  pinned in the viewport while scroll progress drives the animation —
  avoiding GSAP `ScrollTrigger` `pin: true` (the About section's known seam
  source) in favor of native CSS sticky.
- Each of the three logos (Next.js, NestJS, Three.js/"Other") gets a
  sequential, non-overlapping phase along that scroll range: slide-in with a
  spin from a fixed per-logo direction, hold at rest, then slide out and
  disappear ("hide in place," no need to travel off-screen). The whole
  sequence is scrub-driven and reversible — scrolling up exactly reverses
  the in-progress animation, at any point.
- A centered, non-fixed text card overlays the stage showing the active
  phase's title (NEXTJS / NESTJS / OTHER) and a short description, separated
  by a bottom border under the title. The card itself does not animate or
  move; only its content swaps, and it only shows content during each
  logo's "hold" state.
- Background glow behind the stage crossfades between white (Next.js,
  Three.js) and NestJS's red-pink brand color as the active phase changes.
- **BREAKING**: introduce a reusable light/dark theme for `Navbar` and
  `WaveButton` (prop-driven, not a duplicated component), defaulting to
  light for Hero/About and switching to dark once Skills is reached.
- **BREAKING**: the navbar no longer stays hidden for the rest of the
  scroll past About — it reappears (in dark theme) once the user scrolls
  into the Skills section, and hides again / reverts to light if the user
  scrolls back above the About trigger point.

## Capabilities

### New Capabilities
- `theming`: light/dark theme support for shared chrome components
  (navbar, contact CTA button), designed to extend to future site-wide dark
  mode.

### Modified Capabilities
- `skills-section`: replaces the static placeholder requirement with the
  real scroll-driven logo showcase (3D logo cycling, text card, background
  glow). The existing "3D logo assets available" requirement is unaffected.
- `site-navigation`: changes the "Navbar stays hidden through Skills"
  requirement — the navbar now reappears in dark theme once Skills is
  reached, instead of remaining hidden for the rest of the scroll.

## Impact

- `app/components/Skills.tsx` — rebuilt from placeholder into the real
  showcase (likely split into a scene/canvas component, a text-card
  component, and a scroll-driving hook, per the repo's one-concern-per-file
  convention).
- `app/components/skills/models/{NextLogo,NestLogo,ThreeLogo}.tsx` — reused
  as-is; animation/positioning driven externally, not inside these files.
- `app/components/Navbar.tsx`, `app/components/WaveButton.tsx` — gain a
  `theme: "light" | "dark"` prop (or equivalent), replacing hardcoded
  black/white styling.
- `app/hooks/useHeroScrollAnimation.ts` — the navbar hide/show logic (today
  a single one-way hide past `TRIGGER_POINT`) needs a new scroll-linked rule
  for reappearing dark at the Skills boundary; `TRIGGER_POINT` /
  `LOCK_DISTANCE` geometry stays the reference points.
- `app/lib/scrollNavigation.ts` — unaffected in mechanism, but the
  "contact" no-op target remains a no-op since Contact isn't built yet.
- No backend/API/data impact — purely front-end presentational and
  animation work.
