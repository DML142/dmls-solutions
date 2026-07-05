## 1. Section scaffold

- [ ] 1.1 Create `app/components/Contact.tsx`: a plain `min-h-screen` section (`id="contact-section"`, `relative z-20 bg-black`), no sticky-pin, no scroll-jacking
- [ ] 1.2 Add `<Contact />` as the third sibling after `<Skills />` in `app/page.tsx`, unwrapped (no max-width container, consistent with Hero/Skills)
- [ ] 1.3 Confirm the section releases into normal scroll flow with no seam/gap against the bottom of Skills

## 2. Black hole scene — event horizon and disk shader

- [ ] 2.1 Create `app/components/contact/` folder; build `BlackHoleScene.tsx` with an R3F `<Canvas>` (camera position/fov modeled on the About/Skills precedent) mounted inside Contact's sticky-free section
- [ ] 2.2 Add the event horizon: a plain black `meshBasicMaterial` sphere
- [ ] 2.3 Write the shared disk/halo shader (`app/shaders/`) with: radial white-hot-to-amber gradient, angular brightness asymmetry (relativistic-beaming look), and a scrolling noise/turbulence term driven by a `uTime` uniform
- [ ] 2.4 Wrap the shader in an `Effect`-free material (a custom `ShaderMaterial`/`shaderMaterial` on the mesh itself, not a postprocessing `Effect` — this is scene geometry, not a screen-space pass) with a class/controller updating `uTime` via `useFrame`'s `delta`, mirroring the About CRT effect's `update()` pattern
- [ ] 2.5 Build the tilted accretion disk (`RingGeometry`/thin torus) using the shared shader material, tilted ~15-20° off edge-on

## 3. Black hole scene — halo ring and animation

- [ ] 3.1 Add the near-face-on halo ring using the same shader material, sized/positioned to hug the sphere's silhouette so its near side is naturally occluded by the opaque sphere (depth testing) and its far side reads as wrapping over the poles
- [ ] 3.2 Add slow continuous rotation to the disk/halo group via `useFrame`, independent of scroll position
- [ ] 3.3 Add `Bloom` (via `EffectComposer`) tuned brighter/wider than Skills' subtle version, to sell the blown-out glow from the reference photo
- [ ] 3.4 Apply the same viewport-based scale-clamp pattern used in `CRTScene.tsx`/`SkillsScene.tsx` so the scene stays responsive across mobile/tablet/desktop
- [ ] 3.5 Manually verify: disk/halo blend without an obvious seam, scene keeps animating regardless of scroll position, no console errors

## 4. Contact card

- [ ] 4.1 Create `app/components/contact/ContactCard.tsx`: static component (no props driving opacity/animation), centered via `absolute inset-0 flex items-center justify-center`, `rounded-2xl border border-white/20 bg-black/60 backdrop-blur-sm` box matching Skills' card visual language
- [ ] 4.2 "CONTACT" as the title (`border-b` divider beneath, matching `SkillsTextCard`'s title/divider pattern)
- [ ] 4.3 Three link lines in the description: LinkedIn (`https://www.linkedin.com/in/xavier-laine-721aa9396/`, `target="_blank" rel="noopener noreferrer"`), Telegram (label `@volnowan`, href `https://t.me/volnowan`, `target="_blank" rel="noopener noreferrer"`), Gmail (`mailto:demolovfennec@gmail.com`)
- [ ] 4.4 Style links in a distinct blue (e.g. `text-blue-400 hover:text-blue-300 underline`), separate from label text color
- [ ] 4.5 Mount `ContactCard` inside `Contact.tsx` alongside the scene, no fade/blur-ramp logic
- [ ] 4.6 Manually verify responsiveness: card stays centered, legible, and doesn't overflow/clip at mobile, tablet, and desktop widths

## 5. Navbar hides at Contact

- [ ] 5.1 In `Navbar.tsx`, add a third `ScrollTrigger` keyed to `document.getElementById("contact-section")` (`start: "top top"`) hiding the navbar (`onEnter`) and reversing (`onLeaveBack`)
- [ ] 5.2 Manually verify the full round trip: dark/visible through Skills → hidden at Contact → dark/visible again scrolling back into Skills → hidden through About lock → light/visible at the very top

## 6. Integration and cleanup

- [ ] 6.1 Run ESLint and fix any errors; confirm TypeScript strict mode has no `any`/implicit-any/unchecked casts introduced
- [ ] 6.2 Update `PROJECT.md`'s Contact section status (from "not started") and the site-navigation description to mention the new hide-at-Contact zone
- [ ] 6.3 Verify in a real browser via the Chrome extension (real scroll input, not `eval`-driven `scrollTo`, per this project's established lesson that background-tab scrolling freezes both GSAP's ticker and R3F's render loop)
