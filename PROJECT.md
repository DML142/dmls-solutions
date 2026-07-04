# Portfolio — Project Specification

This document is the source of truth for the project's vision, structure, and rules. It is referenced by `AGENTS.md` / `CLAUDE.md` and should be kept up to date as decisions are made.

## 1. Overview

A personal portfolio site built as a single-page scroll experience, divided into **4 sections**, each with its own distinct visual design/theme. Sections transition from elegant/vector → retro/CRT → tech/skills → cosmic/contact.

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router — see `AGENTS.md`, this is a non-standard version; check `node_modules/next/dist/docs/` before writing framework code) |
| Language | TypeScript, **strict mode**, full type safety (no `any`, no implicit any, no unchecked casts) |
| Styling | Tailwind CSS |
| 3D / WebGL | Three.js, React Three Fiber (r3f) |
| Animation | GSAP (scroll-triggered + timeline animations) |
| Icons | lucide-react |
| Linting | ESLint (must pass with no errors before considering work done) |

## 3. Sections

### 3.1 Home / Hero
- Elegant, minimal **vector graphics** style.
- Black stars that follow the cursor (interactive particle/vector field).
- Status: **done** (`Hero.tsx`).

### 3.2 About Me
- **Old retro CRT monitor** aesthetic — green-on-black, pixelated screen.
- **CRT shader** (postprocessing `Effect`): subtle barrel distortion of screen content, scanlines, phosphor tint, vignette, and a retrace band that periodically sweeps top-to-bottom.
- **Monitor bezel** is DOM/Tailwind (gray gradients + inset/outset shadows for a 3D plastic look) so the borders stay undistorted; only the WebGL screen content is warped.
- **Navigation (decided)**: the global DOM navbar **slides up and hides** when the About section is active (reverses on scroll back). In-section navigation is a **menu bar rendered inside the CRT scene** (HOME / ABOUT / SKILLS / CONTACT) — hover fills each button green left-to-right with black text, click scrolls to the section.
- Content: bio text in a bordered terminal box; scene tilts toward the pointer (like the hero text parallax); works on touch.
- **Bottom scroll indicator**: a blocky pixel-art down arrow (2-frame hard-cut bounce, no easing), rendered inside the CRT scene (`about/ScrollArrow.tsx`) so the shader warps/glitches it like everything else. No text label (removed).
- **Hand-off to Skills (decided)**: the monitor **auto-raises** over the hero at the trigger point (toggleActions play/reverse, not scrubbed), holds "pinned" for a lock distance (~3 mouse-wheel notches; distance-based, since counting raw wheel events is unreliable across input devices), then **releases into true native scrolling**: at the exact release point, About flips from `position:fixed` to `position:absolute` (top set to match, transform cleared) via a point `ScrollTrigger` (`onEnter`/`onLeaveBack`), handing it to the browser's own scroll instead of continuing to fake it with a scrubbed transform — a scrub tween can't perfectly pixel-match native scroll under fast/chunky wheel input (it applies on the next animation frame, native scroll paints immediately), which showed up as a visible seam exposing the hero underneath. Key geometry: the hero runway height is `100vh + TRIGGER_POINT + LOCK_DISTANCE` so Skills' top edge in normal flow lands exactly at the release point's document offset. Skills needs `relative z-20` (above the hero's fixed z-10 viewport, below About's z-30).
  - **Two related bugs found and fixed**: (1) fast scrolling could cross both the raise trigger and the release trigger in the same tick — the raise is a real-time 0.7s tween, so on a fast scroll it was still mid-flight when release's `onEnter` reset the transform, and the still-running raise tween then wrote `yPercent:-100` *after* the swap to absolute, landing on a negative document offset (off-screen, About "disappeared"). Fixed by forcing the raise timeline to `.progress(1)` at the start of release's `onEnter`, making it deterministic regardless of scroll speed. (2) `page.tsx` must NOT wrap `<Hero />` in a max-width container — `position:fixed` ignores ancestor width entirely (which is why this worked while raised/pinned), but `position:absolute` (used during the release) IS constrained by the nearest positioned ancestor's width, so a `max-w-7xl` wrapper shrank About to 1280px centered during release, leaving margins where the hero's still-unconstrained fixed layer showed through. `<Hero />` and `<Skills />` both live directly in `<main>`, unwrapped.
- **CRT scene scale (decided)**: `about/CRTScene.tsx` clamps scale by whichever axis is tighter — `min(1, viewport.width/DESIGN_WIDTH, viewport.height/DESIGN_HEIGHT)` — like `object-fit: contain`, so on short/wide desktop windows the whole scene (menu, bio box, arrow) shrinks together instead of only checking width and letting the bio box overlap the menu.
- Status: **in progress** (`About.tsx`, `about/CRTScene.tsx`, `about/CRTMenu.tsx`, `about/BioTerminal.tsx`, `about/ScrollArrow.tsx`, `shaders/crtFragmentShader.ts`, `effects/CRTEffect.ts`).

### 3.3 Skills
- Background featuring Next.js and NestJS branding/motifs.
- Center: a medium-sized "window" UI that cycles/displays skills in order:
  1. Next.js
  2. NestJS
  3. Others (GSAP, Three.js, R3F)
- 3D icons animate in response to scroll position (scroll-linked animation, likely GSAP ScrollTrigger driving r3f object transforms).
- **3D logo assets ready**: Next.js, NestJS, and Three.js marks modeled/solidified in Blender, exported as glTF, optimized with `@gltf-transform/cli` (nextjs.glb: 15.4KB→8.9KB, ~188 tris; nestjs.glb: 59.5KB→28.2KB, ~846 tris; threejs.glb: 49.2KB→48.7KB, ~1064 tris), and converted to typed R3F components with `gltfjsx` — `public/models/{nextjs,nestjs,threejs}.glb`, `app/components/skills/models/{NextLogo,NestLogo,ThreeLogo}.tsx`.
- **Placeholder section wired up**: `Skills.tsx` (fullscreen black bg, "SKILLS" text, `id="skills-section"`) is rendered as a normal-flow sibling after Hero in `page.tsx`, becoming visible once the About monitor's scroll hand-off completes. Real scene composition (camera framing, materials/lighting, scroll-linked animation) not yet built.
- **In-scene menu navigation (decided)**: the CRT menu's HOME/ABOUT/SKILLS buttons scroll via GSAP's `ScrollToPlugin` (`gsap.to(window, { scrollTo: ... })`, 1s `power2.inOut`, `autoKill:true`) instead of the browser's native `scrollTo(behavior:"smooth")`. HOME → top; ABOUT → `TRIGGER_POINT + LOCK_DISTANCE/2` (guaranteed inside the pinned/static range, not "scroll to document bottom" which used to work only because About was the last section — now overshoots into Skills); SKILLS → `document.getElementById('skills-section')`. CONTACT stays a no-op until that section exists.
- Status: **not started** (assets + placeholder section ready).

### 3.4 Contact
- Full 3D scene: an **animated black hole**.
- Minimal text overlay with contact info/links.
- Status: **not started**.

## 4. Engineering Rules

- **OOP & standard programming principles**: encapsulate logic sensibly (e.g., class-based or well-scoped hook/controller patterns for 3D scenes), avoid god-components.
- **Responsive design**: every section must work across mobile/tablet/desktop breakpoints — this includes 3D canvases and shader effects, not just layout.
- **Structure & readability**: code should be simple to read and organized (one concern per file/component, clear naming, no premature abstraction).
- **Official docs first**: consult official documentation (Next.js docs in `node_modules/next/dist/docs/`, Three.js, R3F, GSAP) before implementing — this repo's Next.js is a modified/breaking version, so training-data assumptions may be wrong.
- **Comments**: use `//` or `{/* */}` only for non-obvious hard math/logic (e.g., shader math, particle physics, easing curves). Do not comment obvious code.
- **TypeScript strict mode**: no type errors, no `any` escape hatches without justification.
- **ESLint clean**: no lint errors in delivered code.

## 5. Open Questions / Gaps to Decide

These weren't specified and should be resolved before/while building the later sections:

1. **Navigation model** — is this a single scrolling page (all 4 sections stacked, navbar scrolls/snaps between them) or separate routes? Navbar behavior (snap-scroll vs free scroll) affects the CRT-deformed navbar implementation significantly.
2. **Section transitions** — do sections hard-cut, or is there a transition/morph effect between such different visual styles (vector → CRT → tech → space)?
3. **Performance/fallback strategy** — multiple heavy WebGL scenes (stars, CRT shader, 3D icons, black hole) on one page can be expensive, especially on mobile. Do you want a lower-fidelity/static fallback on low-end devices or reduced-motion preference?
4. **Content** — actual copy/bio for About, the full skills list beyond Next/Nest/GSAP/Three/R3F, and real contact links (email, GitHub, LinkedIn, etc.).
5. **Color/typography system** — no shared design tokens (fonts, base palette outside each section's theme) were specified; each section has its own theme, but is there a unifying brand element (logo, favicon, font family)?
6. **Deployment target** — Vercel (default for Next.js) or elsewhere? Affects any edge/runtime-specific constraints.
7. **Accessibility** — no a11y requirements stated (keyboard nav, reduced-motion, screen-reader fallback text for 3D-only content). Recommended given heavy animation/WebGL use.

## 6. Status Snapshot (as of 2026-07-02)

- `Hero.tsx`, `About.tsx`, `Navbar.tsx`, `WaveButton.tsx` exist and are under active edit.
- `Hero.tsx` done for now and don't need any updateds, except then asked to edit it.
- Skills and Contact sections not yet started.
