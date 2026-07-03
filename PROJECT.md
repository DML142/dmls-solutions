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
- Status: **in progress** (`Hero.tsx`).

### 3.2 About Me
- **Old retro CRT monitor** aesthetic — green-on-black, pixelated screen.
- Requires a **CRT/monitor shader** (barrel distortion, scanlines, glow) to sell the "real old monitor" look — implemented as a shader pass (r3f `shaderMaterial` / custom GLSL), not just CSS filters.
- The **navbar must also be rendered inside the CRT deform** — i.e., the navbar is part of the distorted "screen" content, not a normal fixed-position DOM element outside the effect.
- Status: **in progress** (`About.tsx`, `Navbar.tsx`).

### 3.3 Skills
- Background featuring Next.js and NestJS branding/motifs.
- Center: a medium-sized "window" UI that cycles/displays skills in order:
  1. Next.js
  2. NestJS
  3. Others (GSAP, Three.js, R3F)
- 3D icons animate in response to scroll position (scroll-linked animation, likely GSAP ScrollTrigger driving r3f object transforms).
- Status: **not started**.

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
- Skills and Contact sections not yet started.
