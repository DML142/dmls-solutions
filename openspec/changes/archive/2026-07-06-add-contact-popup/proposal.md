> **Amendment (post-implementation)**: after building the popup and
> unifying all three controls behind it, the unification was reverted at
> the user's request. Final behavior: only the navbar's "CONTACT NOW" wave
> button opens the popup. The inline "Contact" nav link and the CRT menu's
> "CONTACT" button both scroll to the Contact section, same as before this
> change — they are a deliberately different affordance from the popup,
> not a redundant path to the same action. The rest of this proposal
> describes the unification as originally planned; the specs under
> `specs/` reflect the corrected final behavior.

## Why

The navbar's "CONTACT NOW" wave button has never had a click handler — it
only plays its hover-fill animation. Visitors who click it (rather than
scrolling all the way to the Contact section) get nothing. We want a quick,
no-scroll way to see the same contact info from anywhere on the page, styled
as a deliberate pastiche of a classic Android "Holo" AlertDialog (per the
reference screenshot), distinct from every other section's visual theme.

While wiring this up, two other "contact" controls turn out to point at the
same underlying intent and should be unified with it: the plain "Contact"
nav-bar link and the CRT in-scene menu's "CONTACT" button currently
scroll to the Contact section (wired in a prior session as a bug fix), but
the original design intent (recorded in `about-section`'s spec) was always
for them to surface contact info directly rather than scroll. Now that the
popup exists, all three controls should trigger it.

## What Changes

- Add a new global contact popup component styled after a classic Android
  Holo `AlertDialog`: dark charcoal body, cyan title/rule/buttons, sharp
  (barely-rounded) corners — reusing the same three contact links
  (LinkedIn, Telegram, Gmail) and label/href/text already in
  `ContactCard.tsx`, copy-pasted rather than shared (the data has exactly
  two consumers and isn't expected to grow a third).
- Wire the navbar's WaveButton ("CONTACT NOW") to open the popup on click —
  its first-ever click behavior.
- **BREAKING (behavioral)**: the navbar's inline "Contact" nav link and the
  CRT in-scene menu's "CONTACT" button switch from scrolling to the Contact
  section to opening the same popup instead.
- Popup dismisses via its Close button, a backdrop click, or the Escape
  key.
- Page scroll is locked while the popup is open, to avoid interaction with
  this site's scroll-jacked sections (About's raise/lock/release, Skills'
  scrub-driven phases) happening invisibly behind the dimmed backdrop.
- The popup always renders in its fixed Holo skin regardless of the
  navbar's current light/dark theme.

## Capabilities

### New Capabilities
- `contact-popup`: a global, portal-rendered popup showing the site owner's
  contact links in an Android-Holo-styled dialog, openable from three
  navigation controls and dismissible via Close/backdrop/Escape, with
  scroll locked while open.

### Modified Capabilities
- `site-navigation`: the navbar's contact call-to-action button (WaveButton)
  and its inline "Contact" nav link both open the contact popup; the inline
  link no longer scrolls to the Contact section.
- `about-section`: the in-scene menu's CONTACT button opens the contact
  popup instead of being a no-op / scrolling; the stale "not-yet-built
  section" scenario (which predates Skills and Contact both being built) is
  corrected to describe current behavior for all four menu buttons.

## Impact

- New component(s) for the popup (content + Holo styling + open/close
  state + portal rendering + scroll lock), likely owned by `Navbar.tsx`
  since it's the only place the WaveButton (its primary trigger) is
  rendered.
- `WaveButton.tsx` gains an `onClick` prop (currently accepts none).
- `app/lib/scrollNavigation.ts`'s `"contact"` branch (scroll-to-element) is
  no longer used by any nav control after this change — the CRT menu and
  navbar's Contact link call the popup's open function instead. Decide
  during design whether to remove the now-dead branch or leave it for
  potential future reuse.
- `app/components/about/CRTMenu.tsx`'s CONTACT menu item switches from
  `scrollToSection("contact")` to opening the popup — needs a way to reach
  outside the R3F canvas into DOM-level popup state.
