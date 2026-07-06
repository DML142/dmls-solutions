## 1. Section scaffold

- [x] 1.1 Create `app/components/Contact.tsx`: a plain `min-h-screen` section (`id="contact-section"`, `relative z-20 bg-black`), no sticky-pin, no scroll-jacking
- [x] 1.2 Add `<Contact />` as the third sibling after `<Skills />` in `app/page.tsx`, unwrapped (no max-width container, consistent with Hero/Skills)
- [x] 1.3 Confirm the section releases into normal scroll flow with no seam/gap against the bottom of Skills

## 2. Black hole scene — event horizon and disk shader

- [x] 2.1 Create `app/components/contact/` folder; build `BlackHoleScene.tsx` with an R3F `<Canvas>` (camera position/fov modeled on the About/Skills precedent) mounted inside Contact's sticky-free section
- [x] 2.2 Add the event horizon: a plain black `meshBasicMaterial` sphere
- [x] 2.3 Write the shared disk/halo shader (`app/shaders/accretionDiskShader.ts`) with: radial white-hot-to-amber gradient, angular brightness asymmetry (relativistic-beaming look), and a scrolling streak/turbulence term driven by a `uTime` uniform (sine-sums rather than value noise, so the pattern is seam-free at the theta wraparound)
- [x] 2.4 Wrap the shader in a material class (`app/effects/AccretionDiskMaterial.ts`, extends `ShaderMaterial` with an `update(delta)` advancing `uTime`, mirroring the About CRT effect's pattern), driven from `useFrame`
- [x] 2.5 Build the tilted accretion disk (`RingGeometry`) using the shared shader material, tilted ~13° off edge-on

## 3. Black hole scene — halo ring and animation

- [x] 3.1 Add the near-face-on halo ring using the same shader material, sized/positioned to hug the sphere's silhouette so its near side is naturally occluded by the opaque sphere (depth testing) and its far side reads as wrapping over the poles
- [x] 3.2 Continuous motion via the shader's differential rotation (inner gas swirls faster), advanced every frame from `useFrame`'s delta — independent of scroll position
- [x] 3.3 Add `Bloom` (via `EffectComposer`) tuned brighter/wider than Skills' subtle version (intensity 1.1, threshold 0.25), to sell the blown-out glow from the reference photo
- [x] 3.4 Apply the same viewport-based scale-clamp pattern used in `CRTScene.tsx`/`SkillsScene.tsx` so the scene stays responsive across mobile/tablet/desktop
- [x] 3.5 Manually verified: disk/halo blend with no visible seam, turbulence pattern visibly advanced between two stationary screenshots (continuous animation), no console errors

## 4. Contact card

- [x] 4.1 Create `app/components/contact/ContactCard.tsx`: static component (no props driving opacity/animation), centered via `absolute inset-0 flex items-center justify-center`, `rounded-2xl border border-white/20 bg-black/60 backdrop-blur-sm` box matching Skills' card visual language
- [x] 4.2 "CONTACT" as the title (`border-b` divider beneath, matching `SkillsTextCard`'s title/divider pattern)
- [x] 4.3 Three link lines in the description: LinkedIn (`https://www.linkedin.com/in/xavier-laine-721aa9396/`, `target="_blank" rel="noopener noreferrer"`), Telegram (label `@volnowan`, href `https://t.me/volnowan`, `target="_blank" rel="noopener noreferrer"`), Gmail (`mailto:demolovfennec@gmail.com`) — all three hrefs/targets/rels verified via DOM inspection in the browser
- [x] 4.4 Style links in a distinct blue (`text-blue-400 hover:text-blue-300 underline`), separate from label text color
- [x] 4.5 Mount `ContactCard` inside `Contact.tsx` alongside the scene, no fade/blur-ramp logic
- [x] 4.6 Responsiveness: card uses the exact structure already viewport-verified on Skills' card (`max-w-md`, `px-6` gutter, `break-all` on long links) plus the scene's contain-style scale clamp. NOTE: a live narrow-viewport screenshot was not possible this session — the Chrome extension's window resize doesn't change the rendered viewport in this environment (same limitation hit and flagged in the Skills change); flagged to the user rather than claimed as visually tested

## 5. Navbar hides at Contact

- [x] 5.1 In `Navbar.tsx`, add a third `ScrollTrigger` keyed to `document.getElementById("contact-section")` hiding the navbar (`onEnter`) and reversing (`onLeaveBack`). Deviation from plan: `start: "top 25%"` instead of `"top top"` — Contact is the final 100vh section, so its top reaches the viewport top only at the document's absolute maximum scroll; `"top top"` fired on the very last pixel or never (caught live in the browser)
- [x] 5.2 Manually verified the round trip with real wheel scrolling: dark/visible through Skills → hidden at Contact (caught mid-hide, stays dark while sliding away) → dark/visible again scrolling back into Skills

## 6. Integration and cleanup

- [x] 6.1 ESLint zero errors; `tsc --noEmit` clean (strict mode, no `any`/unchecked casts)
- [x] 6.2 Updated `PROJECT.md`'s Contact section (fake-lensing composition, card, navbar zone, deliberate no-op Contact buttons; status → in progress) — site-navigation behavior captured there under the Contact section entry
- [x] 6.3 Verified in a real browser via the Chrome extension using real scroll input only (per this project's established lesson that `eval`-driven scrolling backgrounds the tab and freezes both GSAP's ticker and R3F's render loop — which indeed produced one misleading all-black frame after an `eval`-initiated reload this session, resolved by real-input scrolling)
