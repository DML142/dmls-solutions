## 1. Verify specs against the live app

- [x] 1.1 Walk through every scenario in `specs/hero-section/spec.md` against
      the running app (star field, intro reveal, pointer tilt, arrow fill)
- [x] 1.2 Walk through every scenario in `specs/site-navigation/spec.md`
      (navbar visible at load, hides on About raise, stays hidden through
      Skills, reappears on scroll-back)
- [x] 1.3 Walk through every scenario in `specs/about-section/spec.md`,
      including the fast-scroll and scroll-back-reversal edge cases
- [x] 1.4 Confirm `specs/skills-section/spec.md` matches the current
      placeholder + asset state (no scene-composition claims snuck in)
- [x] 1.5 Confirm `specs/contact-section/spec.md` matches the agreed intent
      in `PROJECT.md` section 3.4 (no implementation exists yet — this is a
      documentation check, not a build check)

## 2. Reconcile with PROJECT.md

- [x] 2.1 Cross-check each spec's requirements against the corresponding
      `PROJECT.md` section (3.1–3.4) and note/resolve any mismatch
- [x] 2.2 Confirm `openspec/config.yaml` context accurately summarizes the
      stack and engineering rules from `AGENTS.md` / `CLAUDE.md` / `PROJECT.md`

## 3. Finalize

- [x] 3.1 Run `openspec change validate document-existing-portfolio-sections --strict`
      and fix any validation errors
- [ ] 3.2 Archive the change (`openspec archive document-existing-portfolio-sections`)
      so `openspec/specs/` reflects these five capabilities as the current baseline
