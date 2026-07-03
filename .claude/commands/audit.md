---
description: Check for hidden errors/warnings and flag hard-to-read files that should be split out
---

Run a project health audit. Do the following in order and report findings concisely (grouped by category, with file:line references):

1. **Type errors** — run `npx tsc --noEmit` and list every error, with file:line and a one-line explanation.
2. **Lint errors/warnings** — run `npx eslint .` and list every issue, including warnings (do not silently ignore warnings).
3. **Build errors** — run `npm run build` and surface any errors or warnings the dev server normally hides (unused exports, hydration mismatches, etc).
4. **Readability / structure scan** — read through `app/` (and any other source dirs) and flag files that are hard to read or doing too much, specifically:
   - Components mixing unrelated concerns (e.g. UI + shader/GLSL code + animation logic all in one file)
   - Files over ~200-300 lines that could be split (e.g. shaders into `*.glsl`/`shaders/`, hooks into `hooks/`, types into `types/`, constants into `constants/`)
   - Repeated inline logic that should be extracted into a shared util/hook
   - For each flagged file, propose a concrete target location (e.g. "extract CRT shader from `About.tsx` into `app/shaders/crtShader.ts`") — do not just say "this is messy."
5. Skip fixing anything unless asked — this command is diagnostic only. End with a prioritized punch list (must-fix errors first, then structural suggestions).
