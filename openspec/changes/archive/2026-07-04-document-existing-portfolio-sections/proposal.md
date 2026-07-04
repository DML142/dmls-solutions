## Why

The portfolio has been built for several iterations (Hero, About/CRT, and the Skills
placeholder + 3D assets already exist; Contact's intent is decided but unbuilt) with
no OpenSpec capability specs to show for it — behavior and decisions live only in
`PROJECT.md`, commit history, and chat context. Before any further changes are
proposed through OpenSpec, the already-agreed behavior needs to be captured as
baseline specs so future proposals have something concrete to diff against instead
of re-deriving intent from scratch each time.

## What Changes

- Add baseline specs for the two fully-implemented sections (Hero, About/CRT) that
  describe their current, working behavior exactly as built — no behavior changes.
- Add a baseline spec for the global site navigation (navbar), since its hide/show
  behavior is coupled to About's scroll state and spans both sections.
- Add a baseline spec for the Skills section covering what's decided/ready today
  (placeholder content, 3D logo assets, hand-off timing) without inventing the
  still-open scene composition and scroll-linked animation design.
- Add a baseline spec for Contact capturing the already-decided intent (animated
  3D black hole + contact info overlay) even though no implementation exists yet,
  so the eventual build has an agreed target instead of an open question.
- No code changes — this documents existing/decided behavior only.

## Capabilities

### New Capabilities
- `hero-section`: the vector-graphics landing view — interactive cursor-following
  star field, intro title/subtitle reveal, scroll-fill arrow indicator.
- `site-navigation`: the global navbar (link set, contact CTA) and its scroll-tied
  hide/show behavior during the Hero→About transition.
- `about-section`: the retro CRT monitor scene — shader effect, bezel, in-scene
  menu, bio terminal, scroll-down indicator, and the raise/lock/release hand-off
  into Skills.
- `skills-section`: the tech-stack showcase section — current placeholder state,
  the 3D logo assets already prepared for it, and its position in the scroll flow.
- `contact-section`: the closing section — animated black hole scene with a
  contact-info overlay (decided intent, not yet implemented).

### Modified Capabilities
(none — this change only adds baseline specs, it does not change existing
requirements since no specs exist yet)

## Impact

Documentation only: adds `openspec/specs/{hero-section,site-navigation,about-section,skills-section,contact-section}/spec.md`.
No application code, dependencies, or runtime behavior changes. `PROJECT.md`
remains the narrative source of truth; these specs are the structured,
requirement/scenario form of the same decisions and should be kept in sync
with it going forward.
