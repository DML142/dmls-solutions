## Context

Hero and About/CRT are fully built; Skills has a placeholder plus ready 3D
assets; Contact is undecided in code but its intent was already agreed
verbally and recorded in `PROJECT.md`. This change adds no code — it only
writes down the architecture and decisions that already exist so future
OpenSpec proposals have specs to diff against instead of re-deriving intent
from `PROJECT.md`, commit history, and prior conversations each time.

## Goals / Non-Goals

**Goals:**
- Capture the current, working behavior of Hero, site navigation, and
  About/CRT exactly as implemented — no behavior changes.
- Capture Skills' current (placeholder + assets-ready) state without
  inventing the still-undecided scene composition.
- Capture Contact's already-agreed intent (black hole scene + contact
  overlay) as a spec, even though it isn't implemented yet, so the eventual
  build has an agreed target.

**Non-Goals:**
- Redesigning or changing any existing behavior.
- Deciding Skills' scene composition, camera framing, or scroll-linked
  animation — those remain open and should be their own future proposal.
- Deciding Contact's black-hole rendering approach (shader vs. particle
  system vs. off-the-shelf) — the spec only fixes the agreed *what*, not the
  *how*.

## Decisions

- **Five capabilities, not one monolithic spec**: `hero-section`,
  `site-navigation`, `about-section`, `skills-section`, `contact-section`.
  Site navigation is split out from Hero/About because its hide/show
  behavior is a single cross-cutting concern spanning both sections, and
  keeping it separate avoids duplicating the same requirement in two specs.
- **Contact gets a spec despite having no implementation**: OpenSpec's value
  is agreeing on behavior before code exists. Contact's requirements
  (animated black hole background, contact-info overlay) were already
  decided in `PROJECT.md`; writing them as a spec now means the first
  implementation PR can be checked against an existing contract instead of
  introducing one after the fact.
- **About's scroll hand-off is specified at the behavior level, not the
  mechanism level**: the spec describes "auto-raise, lock, release into
  native scroll, reversible" and the fast-scroll/no-visual-gap guarantees,
  without mandating GSAP, `ScrollTrigger`, or the specific `position:fixed`
  → `position:absolute` technique used to implement it. `PROJECT.md` remains
  the place for that implementation-level detail (including the two bugs
  found and fixed while building it); the spec only needs to hold if the
  implementation is ever swapped out.
- **`PROJECT.md` stays the narrative source of truth; specs are the
  structured form of the same decisions.** When a future change modifies a
  requirement captured here, both `PROJECT.md` and the relevant spec should
  be updated together (see `openspec/config.yaml` context note).

## Risks / Trade-offs

- [Spec drifts from `PROJECT.md` over time as one gets updated without the
  other] → Mitigation: `openspec/config.yaml`'s project context explicitly
  instructs future changes to update both together; PROJECT.md's section
  headings map 1:1 to these capability names to make the connection obvious.
- [Contact's spec could turn out to not match whatever is actually easiest to
  build once implementation starts] → Mitigation: this is exactly what
  OpenSpec change proposals are for — if implementation reveals the spec is
  wrong, propose a `MODIFIED Requirements` delta against `contact-section`
  rather than silently diverging from it.
