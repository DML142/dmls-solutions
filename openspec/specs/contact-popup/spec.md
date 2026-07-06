# contact-popup Specification

## Purpose
TBD - created by change add-contact-popup. Update Purpose after archive.

## Requirements

### Requirement: Global contact popup
The site SHALL provide a single global contact popup, styled as a
pastiche of a classic Android "Holo" `AlertDialog` (dark charcoal body,
cyan title/rule/buttons, barely-rounded corners), showing the title
"CONTACT", the same three contact links shown in the Contact section
(LinkedIn, Telegram, Gmail — each a real clickable link), and a "CLOSE"
button. The popup SHALL render above the navbar and every section
regardless of scroll position, and SHALL use the same fixed visual skin
regardless of the navbar's current light/dark theme.

#### Scenario: Opening the popup
- **WHEN** the user triggers any of the popup's open controls
- **THEN** the popup appears centered over a dimmed backdrop, showing
  "CONTACT" as its title, the LinkedIn/Telegram/Gmail links, and a CLOSE
  button, in the Holo dialog style regardless of the navbar's current
  theme

#### Scenario: Clicking a contact link inside the popup
- **WHEN** the user clicks one of the popup's contact links
- **THEN** the same destination opens as clicking the equivalent link in
  the Contact section (LinkedIn/Telegram profile in a new tab, or a Gmail
  compose window addressed to the site owner)

### Requirement: Popup open trigger
The contact popup SHALL be openable from the navbar's "CONTACT NOW" wave
button. The navbar's inline "Contact" nav link and the About section's
in-scene CRT menu "CONTACT" button are a separate affordance — they scroll
to the Contact section and do not open the popup.

#### Scenario: Clicking the navbar wave button
- **WHEN** the user clicks the navbar's "CONTACT NOW" button
- **THEN** the contact popup opens

#### Scenario: Clicking the inline Contact nav link or CRT menu CONTACT button
- **WHEN** the user clicks the navbar's inline "Contact" link or the About
  section's in-scene CRT menu "CONTACT" button
- **THEN** the page scrolls to the Contact section; the contact popup does
  not open

### Requirement: Popup dismissal
The contact popup SHALL be dismissible via its CLOSE button, a click on
the dimmed backdrop outside the dialog, or the Escape key.

#### Scenario: Clicking CLOSE
- **WHEN** the popup is open and the user clicks its CLOSE button
- **THEN** the popup closes

#### Scenario: Clicking the backdrop
- **WHEN** the popup is open and the user clicks outside the dialog card
- **THEN** the popup closes

#### Scenario: Pressing Escape
- **WHEN** the popup is open and the user presses the Escape key
- **THEN** the popup closes

#### Scenario: Clicking inside the dialog card
- **WHEN** the popup is open and the user clicks anywhere inside the
  dialog card itself (including a contact link)
- **THEN** the popup does not close from that click alone

### Requirement: Scroll lock while open
The page SHALL NOT scroll while the contact popup is open, restoring
normal scroll behavior once it closes.

#### Scenario: Attempting to scroll with the popup open
- **WHEN** the contact popup is open and the user attempts to scroll the
  page
- **THEN** the page does not scroll, and the sections/animations behind
  the dimmed backdrop do not advance

#### Scenario: Scrolling after the popup closes
- **WHEN** the contact popup has just closed
- **THEN** the page scrolls normally again from wherever it was before
  the popup opened
