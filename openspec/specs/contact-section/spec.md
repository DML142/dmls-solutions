# contact-section Specification

## Purpose
TBD - created by archiving change document-existing-portfolio-sections. Update Purpose after archive.
## Requirements
### Requirement: Animated black hole scene
The Contact section SHALL present a full 3D scene depicting an animated
black hole as its background, positioned as the final section in the
scroll flow. The scene SHALL approximate the visual signature of a
gravitationally-lensed accretion disk (a black event-horizon sphere, a
turbulent glowing disk, and a halo of light appearing to wrap over the
sphere's poles) without requiring a physically-accurate lensing simulation.
The scene SHALL animate continuously on its own clock, independent of
scroll position — it SHALL NOT pause, reset, or otherwise depend on
scrolling into or out of view.

#### Scenario: Scrolling to the end of the page
- **WHEN** the user scrolls to the Contact section
- **THEN** an animated 3D black hole scene fills the section's background,
  showing a black sphere, a glowing turbulent disk, and light appearing to
  wrap around the sphere's top and bottom

#### Scenario: Scene continues animating regardless of scroll
- **WHEN** the user stops scrolling while the Contact section is in or out
  of view
- **THEN** the black hole scene's disk rotation and turbulence keep
  animating without interruption

### Requirement: Contact information overlay
The Contact section SHALL overlay a single static card on top of the black
hole scene. The card SHALL NOT animate, fade, or otherwise change based on
scroll position — it is always fully visible once the section is mounted.
The card SHALL display the title "CONTACT" separated by a divider from a
description containing three real, clickable contact links: LinkedIn,
Telegram, and Gmail. Links SHALL be styled in a distinct blue color so
they read clearly as clickable, separate from the surrounding label text.

#### Scenario: Contact section is visible
- **WHEN** the Contact section is in view
- **THEN** a single card is visible with "CONTACT" as its title, a divider,
  and three contact links (LinkedIn, Telegram, Gmail) legible over the
  animated background

#### Scenario: Clicking the LinkedIn link
- **WHEN** the user clicks the LinkedIn link
- **THEN** the site owner's LinkedIn profile opens in a new tab

#### Scenario: Clicking the Telegram link
- **WHEN** the user clicks the Telegram link
- **THEN** the site owner's Telegram chat (`https://t.me/volnowan`) opens in
  a new tab

#### Scenario: Clicking the Gmail link
- **WHEN** the user clicks the Gmail link
- **THEN** the user's default mail client opens a new message addressed to
  the site owner's Gmail address

#### Scenario: Card is responsive
- **WHEN** the Contact section is viewed on mobile, tablet, or desktop
  widths
- **THEN** the card remains centered, legible, and does not overflow or
  clip its content at any width

