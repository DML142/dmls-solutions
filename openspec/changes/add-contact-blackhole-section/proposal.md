## Why

Contact is the last of the four sections and hasn't been started — right now
the page just ends after Skills. The site needs a closing "cosmic" section:
an animated black hole scene with the site owner's real contact details
(LinkedIn, Telegram, Gmail) as clickable links, so visitors have something
to click at the natural end of the scroll.

## What Changes

- Add a new Contact section (`app/components/Contact.tsx`) as the final
  sibling in the page's scroll flow, directly after Skills — a plain
  `min-h-screen` section, not scroll-jacked or sticky-pinned like About/Skills,
  since there's nothing to cycle between and no phase state to track.
- Build a fake-but-visually-matching black hole R3F scene: an opaque black
  event-horizon sphere, a tilted turbulent-glow accretion disk, and a second
  near-face-on halo ring that reads as the disk's light bending over the
  poles — approximating the reference image's signature look without a true
  gravitational-lensing ray-marcher. Continuously self-animating (disk
  rotation + shader turbulence scroll) via its own clock, not scroll-driven.
- Add one static, non-animated contact card (reusing the Skills card's visual
  language — rounded, translucent black, bordered, divider under the title)
  with "CONTACT" as the title and three real, clickable links as the
  description: LinkedIn, Telegram (`@volnowan` → `https://t.me/volnowan`),
  and Gmail (`mailto:`), styled in a distinct blue link color. No fade-in,
  no scroll-linked opacity/blur — it's simply always visible once mounted.
- **BREAKING**: extend the navbar's scroll-linked visibility so it hides
  again once the user reaches the Contact section (it currently stays
  visible/dark for the rest of the scroll past Skills with no end point),
  reversing when scrolling back above Contact's start.
- Explicitly out of scope this round: wiring the navbar's "Contact" link or
  the CRT in-scene menu's "CONTACT" button to jump to this section.
  `scrollToSection`'s `"contact"` branch stays a no-op — that button is
  slated to open a popup later, and wiring a scroll-jump now would be
  throwaway work.

## Capabilities

### New Capabilities
(none — extends the existing `contact-section` capability's already-drafted
requirements rather than introducing a new one)

### Modified Capabilities
- `contact-section`: refines "Animated black hole scene" with the specific
  fake-lensing technique and always-on animation, and refines "Contact
  information overlay" with the concrete single-card structure, exact
  content, and clickable-link styling.
- `site-navigation`: adds a third zone to the navbar's scroll-linked
  visibility — hidden again once Contact is reached, reversing on scroll-back.

## Impact

- `app/components/Contact.tsx` — new section component, normal document flow,
  unwrapped (no max-width container) for consistency with Hero/Skills.
- `app/components/contact/` — new subfolder for the black hole scene pieces
  (event horizon, accretion disk + shader, halo ring), mirroring the
  `app/components/skills/` and `app/components/about/` folder patterns.
- `app/components/contact/ContactCard.tsx` — new static card component,
  visually modeled on `SkillsTextCard.tsx` but with no fade/blur-ramp logic.
- `app/components/Navbar.tsx` — gains a third `ScrollTrigger` (keyed to the
  Contact section's own DOM element, since Contact's start offset isn't a
  fixed pixel constant like Hero/Skills' geometry) to hide the navbar once
  Contact begins.
- `app/page.tsx` — `<Contact />` added as the third section after `<Skills />`.
- `app/lib/scrollNavigation.ts` — unchanged; the `"contact"` no-op stays as-is.
- No backend/API/data impact — purely front-end presentational and
  animation work.
