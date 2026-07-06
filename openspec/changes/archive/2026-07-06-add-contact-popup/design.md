> **Amendment (post-implementation)**: three corrections to what's below,
> made after initial implementation and verification:
> 1. The three-trigger unification (Decision context above, and the
>    `CRTMenu`/`NavBar` wiring in Decision 2) was reverted at the user's
>    request. Only the WaveButton opens the popup; the inline "Contact"
>    nav link and CRT menu's CONTACT button scroll to the Contact section
>    as they did before this change. `scrollToSection`'s `"contact"`
>    branch was restored rather than removed, and `SectionTarget` is once
>    again its only accepted parameter type (the `ScrollTarget` narrowing
>    in Decision 2 was undone).
> 2. Decision 6's scroll lock, as shipped, locks `overflow` on
>    `document.documentElement` (`<html>`) only, not `document.body`.
>    Locking `<body>` too was found during verification to shift the
>    entire page vertically: `<body>` is a flex column (`layout.tsx`:
>    `flex flex-col`), and giving a flex container `overflow: hidden`
>    changes its children's auto min-size behavior, reflowing everything
>    below the navbar even though `scrollY` never changed. The scrollbar-
>    width compensation (`paddingRight`) was likewise moved to apply to
>    `<html>` only.
> 3. The Close button is centered (not right-aligned) and white (not
>    cyan), matching the reference photo more closely than Decision 4
>    originally called for.

## Context

Three separate controls need to trigger the same popup, and they live in
two disconnected parts of the React tree:

- `NavBar` (`app/layout.tsx`, sibling to `{children}`, not a descendant of
  `page.tsx`'s `<main>`) — home of both the WaveButton CTA and the inline
  "Contact" nav link.
- `CRTMenu` (`app/components/about/CRTMenu.tsx`) — a React Three Fiber
  component several layers deep inside `<main>` → `Hero` → `About` →
  `CRTScene` → `<Canvas>`, rendered with `@react-three/fiber`'s own
  reconciler rather than the DOM one.

Any shared trigger mechanism has to reach both without prop-drilling
through Hero/About/CRTScene (none of which have any other reason to know
about the contact popup) and without threading state through `layout.tsx`
down into a deeply-nested R3F leaf component by hand.

## Goals / Non-Goals

**Goals:**
- One popup, three trigger points, no prop drilling.
- Popup renders above everything (navbar, canvases, all sections)
  regardless of where in the tree it's triggered from.
- Reuses `ContactCard`'s existing three links verbatim (per the proposal's
  explicit "just copy-paste" decision — this content has exactly two
  consumers, which doesn't justify a shared module).
- Scroll is locked for the page while the popup is open.

**Non-Goals:**
- A generic/reusable `Modal` component. This is one specific dialog with
  one specific skin; building generic modal infrastructure for a single
  usage is exactly the premature abstraction this repo's conventions warn
  against.
- Changing the Holo skin based on the navbar's light/dark theme — it's
  always the same fixed skin (a deliberate "borrowed phone UI" pastiche,
  not a themed site component).

## Decisions

### 1. React Context + Provider mounted in `layout.tsx`, not `page.tsx`
`ContactPopup.tsx` exports a `ContactPopupProvider` (owns `isOpen` state,
renders the backdrop/dialog via a portal, handles Escape/backdrop-click/
scroll-lock) and a `useContactPopup()` hook returning `{ open }`.
`layout.tsx` wraps both `<NavBar />` and `{children}` in the provider:

```tsx
<body className="min-h-full flex flex-col">
  <ContactPopupProvider>
    <NavBar />
    {children}
  </ContactPopupProvider>
</body>
```

This is the only mount point that is an ancestor of *both* trigger
locations (`NavBar` and `CRTMenu`, buried inside `{children}`). `CRTMenu`
calls `useContactPopup()` directly — React context propagates normally
into a `<Canvas>`'s reconciled tree as long as the `<Canvas>` itself sits
inside the provider in the ordinary React element tree (it does, several
layers down), which is the standard, well-documented way r3f apps consume
outer app context; no r3f-specific bridging API is needed here.

**Alternative considered**: a plain module-level event bus
(`window.dispatchEvent(new CustomEvent(...))`) so no provider/context is
needed at all. Rejected — Context is the idiomatic React tool for exactly
this "small piece of state needed by a few unrelated descendants" shape,
and it keeps the open/close logic and DOM scroll-lock side effect in one
place instead of scattered `addEventListener` calls.

### 2. `scrollToSection`'s `"contact"` case is removed, not left dead
Both existing "contact" click sites (`NavBar`'s inline nav item, `CRTMenu`'s
CONTACT button) switch to calling `openPopup()` instead of
`scrollToSection("contact")`. Since nothing will call `scrollToSection`
with `"contact"` anymore, its implementation drops that branch, and its
parameter type narrows from `SectionTarget` to a smaller
`Exclude<SectionTarget, "contact">` (call it `ScrollTarget`) so passing
`"contact"` is a compile-time error rather than a silently-dead runtime
branch. `SectionTarget` itself stays as-is (`NavItem`/`MenuTarget` still
need all four values to pick labels/icons); only `scrollToSection`'s
accepted input narrows.

**Alternative considered**: leave the `"contact"` branch as an unreachable
no-op "for future flexibility." Rejected per this repo's convention of
deleting code once it's confirmed unused rather than keeping speculative
backwards-compatibility shims.

### 3. Portal to `document.body`, `z-[100]`
The popup (backdrop + dialog) renders via `createPortal(..., document.body)`
rather than in-place, so it's never affected by an ancestor's
`overflow-hidden`/`position` (several sections use both) and always paints
above the navbar's own `z-50` fixed layer and every section's WebGL canvas.

### 4. Holo visual language, hard-coded (not theme-driven)
Colors are literal Tailwind arbitrary values matching the reference photo
rather than sourced from any existing theme token (there isn't a shared
palette for this — each section already hard-codes its own theme colors):
charcoal body (`bg-[#2d2d2d]`), cyan accents (`text-[#33b5e5]`,
`border-[#33b5e5]/50`), barely-rounded corners (`rounded-[3px]`), flat
text-only Close button (no fill/border, `hover:bg-white/5` for feedback).
Links keep the same content as `ContactCard` but recolor to the same cyan
accent so the whole dialog reads as one coherent borrowed skin, rather than
mixing in `ContactCard`'s blue.

### 5. Dismiss handling: Escape, backdrop click, Close button — all three
- Escape: a `keydown` listener attached only while `isOpen` (added/removed
  in an effect keyed on `isOpen`, avoiding a permanently-mounted global
  listener).
- Backdrop click: `onClick` on the outer portal container; the dialog card
  itself calls `stopPropagation()` so clicks inside it don't bubble to the
  backdrop.
- Close button: calls the same `close()` used by the other two paths.

### 6. Scroll lock via `document.body.style.overflow`
On open: capture the current `overflow` value, set it to `"hidden"`. On
close/unmount: restore the captured value (not a hard-coded `""`, in case
something else ever sets `overflow` on body). This is the simplest
correct approach for a site with no other component currently touching
`document.body.style.overflow`.

**Alternative considered**: `ScrollTrigger.disable()`/`.enable()` on all
active triggers. Rejected — much larger blast radius (would need to touch
every section's trigger instances) for the same net effect that a body
`overflow:hidden` already achieves by preventing the scroll events that
drive those triggers from firing at all.

### 7. Enter/exit animation via local component state, no GSAP
A simple two-state pattern: `isOpen` (whether the popup should be mounted
at all) and `isVisible` (drives the actual opacity/scale classes, toggled
one tick after mount via a `requestAnimationFrame` for the enter
transition, and immediately on close — with the actual unmount deferred by
the transition's duration via `setTimeout` so the exit transition can play
before the DOM node disappears). Plain Tailwind `transition`/`duration`
classes, no GSAP timeline. This is a purely local, non-scroll-driven
animation on a small conditionally-rendered subtree, exactly the case
GSAP's ScrollTrigger machinery would be overkill for.

## Risks / Trade-offs

- [Risk] Rendering the CRTMenu's contact trigger via a plain React Context
  hook call inside an r3f mesh event handler is slightly non-obvious if
  you don't already know context crosses the Canvas boundary transparently
  in this render tree shape. → Mitigation: this design doc records the
  reasoning; no r3f-specific workaround is actually needed since the
  `<Canvas>` element is still a normal descendant of the provider in the
  React element tree.
- [Trade-off] Duplicating the three contact links between `ContactCard`
  and the popup means a future edit to a link must be made in two places.
  Accepted per the proposal's explicit decision — two call sites doesn't
  justify a shared data module.
