## 1. Theming foundation

- [x] 1.1 Add a `theme: "light" | "dark"` prop (default `"light"`) to `WaveButton`, with a distinct dark class set (border, wave fill, text colors) alongside the existing light classes
- [x] 1.2 Add a `theme: "light" | "dark"` prop (default `"light"`) to `Navbar`, threading it through to `WaveButton`, with a distinct dark class set (background, link text/icon colors) alongside the existing light classes
- [x] 1.3 Manually verify both themes render correctly (light matches current Hero appearance unchanged; dark is legible with no light-theme colors leaking through)

## 2. Navbar visibility/theme state machine

- [x] 2.1 In `useHeroScrollAnimation.ts`, add a second `ScrollTrigger` keyed to the Skills release point (`TRIGGER_POINT + LOCK_DISTANCE`) that shows the navbar again when crossed forward and hides it again when crossed backward
- [x] 2.2 Wire the navbar's active `theme` prop to scroll position (light above `TRIGGER_POINT`'s hide, dark once past the release point), reusing the existing `TRIGGER_POINT`/`LOCK_DISTANCE`/`releasePoint` constants — no new geometry constants
- [x] 2.3 Manually verify the full state machine by scrolling: visible/light at top → hidden through About lock → visible/dark at Skills → hidden again scrolling back into About → visible/light scrolling back to top

## 3. Skills section scaffold

- [x] 3.1 Replace the `Skills.tsx` placeholder with a tall section (`h-[300vh]`, tunable) containing an inner `sticky top-0 h-screen overflow-hidden` stage wrapper
- [x] 3.2 Add a single scroll-scrubbed `ScrollTrigger` (`scrub: true`, `start: "top top"`, `end: "bottom bottom"`) producing a 0-to-1 progress value for the whole section, exposed via a dedicated hook (e.g. `useSkillsScrollProgress`) rather than inline in the component
- [x] 3.3 Implement the pure phase-mapping function (`progress -> { phase: 0|1|2, localProgress }`, thirds-based) as an isolated, testable unit (not embedded in a React component)

## 4. Logo stage (R3F)

- [x] 4.1 Build a `SkillsScene` R3F canvas component that mounts `NextLogo`, `NestLogo`, and `ThreeLogo`, applying viewport-based scale clamping consistent with the existing `CRTScene` pattern
- [x] 4.2 Derive each logo's `position.x` and `rotation.y` from the shared phase/local-progress values per the design's enter/hold/exit split, with per-logo fixed direction constants (Next.js: left→right, NestJS: right→left, Other: left→right)
- [x] 4.3 Ensure only the active phase's logo is positioned on-stage at a given progress value (previous/next logos fully hidden, no accidental overlap)
- [x] 4.4 Manually verify smooth, reversible motion scrolling slowly forward and backward through all three phases, including at phase boundaries

## 5. Background glow

- [x] 5.1 Add a background glow layer (radial-gradient div or equivalent) behind the canvas, colored from the same progress value: white during Next.js/Other, red-pink during NestJS, crossfading at boundaries
- [x] 5.2 Manually verify the color crossfade timing doesn't visually snap at phase boundaries

## 6. Text card

- [x] 6.1 Build a centered (non-fixed) text card component showing a title and description, with a divider between them
- [x] 6.2 Wire the card's visible content to the active phase's hold window only (empty/hidden outside hold), driven by the same phase/local-progress values — no independent animation on the card itself
- [x] 6.3 Write placeholder/jest description text for each of the three phases (NEXTJS, NESTJS, OTHER)
- [x] 6.4 Manually verify the card re-centers correctly across mobile/tablet/desktop viewport widths

## 7. Integration and cleanup

- [x] 7.1 Wire `SkillsScene`, background glow, and text card together inside the sticky stage wrapper from task 3.1
- [x] 7.2 Confirm the section correctly releases into normal scroll flow after its internal range ends, with no seam/gap against whatever follows
- [x] 7.3 Run ESLint and fix any errors; confirm TypeScript strict mode has no `any`/implicit-any/unchecked casts introduced
- [x] 7.4 Update `PROJECT.md`'s Skills section status and the site-navigation/navbar hide-behavior description to match the new implemented behavior

## 8. Visual refinement pass (user feedback round 1)

- [x] 8.1 Stage background: pure black with a small, soft circular glow centered on screen (phase-colored), replacing the full-viewport color wash
- [x] 8.2 Normalize all three logos to the same on-screen size via measured bounding boxes (no hand-tuned per-model multipliers) and make them noticeably bigger
- [x] 8.3 Fix per-model facing orientation (Next.js currently renders mirrored — "И" instead of "N")
- [x] 8.4 Entry spin tumbles on all axes (X/Y/Z), settling level at the hold position
- [x] 8.5 Text card fades in/out with scroll progress at the hold-window edges (scrub-driven opacity, no instant pop; still no independent animation)
- [x] 8.6 Verify all of the above in a real browser via the Chrome extension

## 9. Visual refinement pass (user feedback round 2)

- [x] 9.1 Fix NestJS handedness — bake a half-turn into its geometry and render it double-sided (its filled-curve mesh is single-sided with the lit face turned away)
- [x] 9.2 Off-stage distance derived from viewport width so wide screens don't show parked logos peeking in from the sides
- [x] 9.3 Next.js (and all logos) spin/tumble on exit, not just entry
- [x] 9.4 Reduce spin intensity to a gentle multi-axis tumble with cubic ease-in-out (smoother, less chaotic)
- [x] 9.5 Smoother scroll response via numeric ScrollTrigger scrub (0.8s catch-up) on both the scene and glow
- [x] 9.6 Glow bigger, dimmer, kept within the viewport (78vmin, opacity 0.18)
- [x] 9.7 Verify NestJS/Next/Three orientation, exit spin, off-stage clearing, and glow on desktop + mobile via the Chrome extension

## 10. Visual refinement pass (user feedback round 3)

- [x] 10.1 Longer scroll runway: section height 300vh → 600vh (~200vh per logo)
- [x] 10.2 Smoother scrub: catch-up lag 0.8s → 1.4s on scene + glow (eased in/out feel per wheel notch)
- [x] 10.3 Longer card fade window (CARD_FADE 0.08 → 0.14 of a phase)
- [x] 10.4 Card readability: bg-white/5 → bg-black/60
- [x] 10.5 Remove card backdrop-blur — backdrop-filter ignores the fade wrapper's opacity, so the blur popped in at full strength while the card was still transparent
- [x] 10.6 Fix navbar dark→light flash when scrolling back from Skills: theme swaps now happen only while the navbar is off-screen (light swap moved to the hero trigger point) and are instant (removed transition-colors, which animated the swap visibly)
- [x] 10.7 Verify in Chrome: 600vh section, gradual card fade, dark navbar stays dark through its hide, arrives light at the hero

## 11. Visual refinement pass (user feedback round 4)

- [x] 11.1 Cinematic postprocessing on the Skills canvas only (not the DOM navbar): subtle Bloom glow on the bright logos + a gentle fisheye/barrel distortion over the frame (`FisheyeEffect` / `fisheyeFragmentShader`, `SkillsFisheye`, `EffectComposer` in `Skills.tsx`)
- [x] 11.2 Fisheye preserves alpha (transparent outside the bowed frame) so the DOM background glow still shows through the canvas
- [x] 11.3 Re-add the card backdrop blur while keeping the black fill, ramped by `--card-blur` (= opacity × 10) so it grows in smoothly with the fade instead of popping
- [x] 11.4 Heavier scrub (2.5s catch-up) on scene + glow for a stronger momentum / "keeps going after you stop" feel
- [x] 11.5 Verify in Chrome: logos render with bloom + fisheye, glow shows through, frosted-glass card blurs the logo behind it, no console errors

## 12. Bug fixes (user feedback round 5)

- [x] 12.1 Root-cause the "smooth scroll doesn't work" report: numeric `scrub` only smooths an *animation's* playhead — reading `self.progress` off a bare `ScrollTrigger.create()` (what both hooks did) gives raw, unsmoothed scroll position. Confirmed via GSAP's own docs.
- [x] 12.2 Rewrite `useSkillsScrollProgress` and `SkillsGlow` to tween a proxy value (`gsap.to(state, {value:1, scrollTrigger:{scrub:1.1}})`) and read `state.value` in the tween's own `onUpdate`, so the lag actually applies
- [x] 12.3 Verified live: two screenshots taken back-to-back with zero additional scroll input show the logo continuing its exit tumble on its own — genuine momentum, not just a claim
- [x] 12.4 Fix fisheye cutting off canvas edges: was discarding (alpha 0) any sample landing outside `[0,1]`; switched to clamping the sample coordinate so the frame stays full-bleed
- [x] 12.5 Card blur now ramps correctly since it shares the same fixed smoothed-progress source as opacity
- [x] 12.6 Confirmed no viewport/breakpoint logic was touched this round (only the shader, the two scroll hooks, and the card's inline blur style) — responsive scale-clamp code in `SkillsScene.tsx` (`DESIGN_WIDTH`/`DESIGN_HEIGHT`) is unchanged from its earlier-verified state. Live mobile-viewport re-check blocked by both the Chrome-extension resize tool and Claude_Preview tool not producing a real narrow viewport in this environment this session — flagged to the user rather than claimed as tested.

## 13. Re-investigation: "shader and blur still not working" (user feedback round 6)

- [x] 13.1 Extensive isolation testing (10x/1.5x fisheye strength, solid-red shader override, swapping in the known-working `CRTEffect`, removing `EffectComposer` entirely) all showed identical "nothing renders" results — even with zero postprocessing at all — proving the fault wasn't in the fisheye shader
- [x] 13.2 Root cause: every one of those tests used `javascript_exec`-driven `window.scrollTo()`, which (per this session's earlier finding) sets `document.hidden = true`. That doesn't just throttle GSAP's ticker — it also throttles React Three Fiber's own `requestAnimationFrame`-based render loop, so the canvas was frozen mid-render (or pre-first-frame) for every single one of those "broken" observations
- [x] 13.3 Re-verified with real wheel-scroll input only (tab genuinely focused throughout): fisheye, Bloom, and the ramped card backdrop-blur all render correctly and exactly as designed — no code was actually broken
- [x] 13.4 Removed all diagnostic-only code added during isolation (`DiagRedEffect.ts`, `DiagRed.tsx`, ctor console.log marker, temporary shader overrides) and restored `Skills.tsx`/`FisheyeEffect.ts`/`fisheyeFragmentShader.ts` to the real, working configuration
- [x] 13.5 `tsc`/`eslint` clean after cleanup

## 14. Remove fisheye, keep bloom only (user request)

- [x] 14.1 Removed `<SkillsFisheye />` from the `EffectComposer` in `Skills.tsx`; `Bloom` remains
- [x] 14.2 Deleted the now-unused fisheye files entirely rather than leaving dead code: `SkillsFisheye.tsx`, `FisheyeEffect.ts`, `fisheyeFragmentShader.ts`
- [x] 14.3 `tsc`/`eslint` clean; verified in Chrome with real scroll input — no fisheye bowing/edge distortion, Bloom's soft glow still visible on the bright logo edges, no console errors

## 15. Add subtle Chromatic Aberration (user request)

- [x] 15.1 Added `<ChromaticAberration>` (from `@react-three/postprocessing`) to the same `EffectComposer` as `Bloom`, with a small fixed UV offset (`0.0006, 0.0006`) — kept low-intensity so it reads as a lens fringe, not a glitch
- [x] 15.2 Used `radialModulation` + `modulationOffset={0.3}` so the fringe is near-absent at screen center (where the logos mostly sit) and only grows toward the edges, rather than uniformly smearing color everywhere
- [x] 15.3 `tsc`/`eslint` clean; verified in Chrome with real scroll input — faint red/blue color fringing visible along the logo edges, strongest away from center, no console errors
