## 1. Contact popup component

- [x] 1.1 Create `app/components/ContactPopup.tsx`: `ContactPopupProvider`
  (owns `isOpen` state, renders backdrop + dialog via
  `createPortal(..., document.body)`) and a `useContactPopup()` hook
  returning `{ open }`
- [x] 1.2 Dialog content: "CONTACT" title, cyan hairline divider, the same
  three contact links as `ContactCard.tsx` (LinkedIn, Telegram, Gmail —
  copy-pasted, same hrefs/labels/external flags), a "CLOSE" button
- [x] 1.3 Holo visual styling: charcoal body (`bg-[#2d2d2d]`), cyan title/
  links/button (`text-[#33b5e5]`), barely-rounded corners (`rounded-[3px]`),
  flat text-only Close button, dimmed backdrop — same skin regardless of
  navbar theme
- [x] 1.4 Enter/exit animation via local component state (`isOpen` +
  `isVisible`, `requestAnimationFrame` for enter, deferred unmount via
  `setTimeout` matching the transition duration for exit) using Tailwind
  transition classes, no GSAP
- [x] 1.5 Dismiss handling: Escape key (`keydown` listener added/removed
  with `isOpen`), backdrop click, Close button click — dialog card calls
  `stopPropagation()` so inner clicks (including contact links) don't
  trigger the backdrop's close
- [x] 1.6 Scroll lock: on open, capture and set `document.body.style.overflow
  = "hidden"`; on close/unmount, restore the captured value

## 2. Wire up the three trigger points

- [x] 2.1 `app/layout.tsx`: wrap `<NavBar />` and `{children}` in
  `ContactPopupProvider` (the only common ancestor of the navbar and the
  About section's CRT menu)
- [x] 2.2 `WaveButton.tsx`: add an `onClick` prop (currently accepts none),
  passed through to the underlying `<button>`
- [x] 2.3 `Navbar.tsx`: call `useContactPopup()`; pass `open` as
  `WaveButton`'s `onClick`; branch the inline nav item click handler so
  `target === "contact"` calls `open()` instead of `scrollToSection`
- [x] 2.4 `CRTMenu.tsx`: call `useContactPopup()`; change the CONTACT
  item's `onSelect` to call `open()` instead of
  `scrollToSection("contact")`

## 3. Clean up the now-unused scroll branch

- [x] 3.1 `app/lib/scrollNavigation.ts`: remove the `"contact"` case from
  `scrollToSection`'s implementation; narrow its parameter type to
  `Exclude<SectionTarget, "contact">` (or an equivalent explicit
  `ScrollTarget` type) so passing `"contact"` is a compile-time error
- [x] 3.2 Update the two call sites (`Navbar.tsx`, `CRTMenu.tsx`) so they
  only ever pass the narrowed type to `scrollToSection`, matching the
  branch added in 2.3/2.4

## 4. Integration and verification

- [x] 4.1 ESLint zero errors; `tsc --noEmit` clean (strict mode, no `any`/
  unchecked casts)
- [x] 4.2 Verify in a real browser via the Chrome extension using real
  click/keyboard input: popup opens from all three triggers, closes via
  Close/backdrop/Escape, contact links work, page doesn't scroll while
  open, scroll resumes correctly after closing. NOTE: found and fixed a
  real bug during verification — scroll lock only worked once both
  `document.documentElement` and `document.body` had `overflow: hidden`
  set (`document.scrollingElement` is `<html>` here, not `<body>`). The
  navbar's inline "Contact" text link (only visible at the `md:` Tailwind
  breakpoint) could not be visually screenshotted this session — this
  environment's window resize doesn't change the rendered viewport (a
  known limitation hit in prior sessions too) — but it uses the identical
  `item.target === "contact" ? openContactPopup() : scrollToSection(...)`
  branch already verified working via the CRT menu's CONTACT button.
- [x] 4.3 Update `PROJECT.md`'s Contact section (and any relevant note in
  the About/Skills sections about the CRT menu's CONTACT button) to
  describe the popup and its three trigger points
