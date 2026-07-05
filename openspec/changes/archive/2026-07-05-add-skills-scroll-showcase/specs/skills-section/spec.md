## MODIFIED Requirements

### Requirement: Skills placeholder in scroll flow
The Skills section SHALL exist as a scroll-driven showcase positioned
immediately after the Hero/About scroll runway, so it becomes reachable the
moment the About monitor releases. Its stage (3D logo canvas, background
glow, and text card) SHALL remain pinned in the viewport (via native CSS
sticky positioning) for a tall internal scroll range, cycling sequentially
through three phases — Next.js, NestJS, and Other (Three.js/GSAP/R3F) —
before releasing into normal scroll flow toward whatever section follows.

#### Scenario: Scrolling past the About release point
- **WHEN** the user scrolls past the About section's release point
- **THEN** the Skills section's stage (canvas, glow, and text card) comes
  into view with no gap or overlap with the About section above it

#### Scenario: Scrolling through the full Skills showcase
- **WHEN** the user scrolls continuously from the Skills section's start to
  its end
- **THEN** the stage stays pinned in the viewport the entire time, and the
  three logo phases play in order (Next.js, then NestJS, then Other)
  without any gap of empty stage between them

#### Scenario: Scrolling past the end of Skills
- **WHEN** the user scrolls past the end of the Skills section's internal
  scroll range
- **THEN** the stage releases from its pinned position and normal page
  scroll continues into the next section

## ADDED Requirements

### Requirement: Sequential logo phase animation
Each of the three logo phases SHALL play as a scroll-scrubbed
enter-hold-exit sequence: the logo slides in from a fixed per-logo
direction while rotating, comes to rest for a hold period, then continues
in the same direction until it is no longer visible. The entire sequence
SHALL be a direct, reversible function of scroll position — scrolling
partway and then reversing SHALL exactly reverse the in-progress motion at
any point, with no independent timers or one-shot animations.

#### Scenario: Scrolling forward through the Next.js phase
- **WHEN** the user scrolls forward through the Next.js phase's scroll
  range
- **THEN** the Next.js logo slides in from the left while rotating, holds
  at rest, then continues moving right until it is no longer visible,
  before the NestJS phase begins

#### Scenario: Scrolling forward through the NestJS phase
- **WHEN** the user scrolls forward through the NestJS phase's scroll range
- **THEN** the NestJS logo slides in from the right while rotating, holds
  at rest, then continues moving left until it is no longer visible, before
  the Other phase begins

#### Scenario: Scrolling forward through the Other (Three.js) phase
- **WHEN** the user scrolls forward through the Other phase's scroll range
- **THEN** the Three.js logo slides in from the left while rotating, holds
  at rest, then continues moving right until it is no longer visible

#### Scenario: Reversing mid-animation
- **WHEN** the user scrolls back up while any logo's slide, spin, or hide
  motion is in progress
- **THEN** that motion smoothly reverses in lockstep with scroll position,
  with no snapping or replay from the start

### Requirement: Centered text card synced to each phase's hold state
A single text card SHALL be centered on screen (using layout centering, not
`position: fixed`) so it re-centers correctly at any viewport size. The card
SHALL display a title (NEXTJS, NESTJS, or OTHER) and a short description
matching whichever phase is currently in its hold state, separated by a
visible divider between the title and the description. The card itself
SHALL NOT animate or move — only its displayed content changes.

#### Scenario: A logo reaches its hold state
- **WHEN** the Next.js, NestJS, or Other logo reaches its hold position
- **THEN** the text card displays that phase's title and description,
  with a divider line between the title and the description

#### Scenario: A logo is entering or exiting (not holding)
- **WHEN** a logo is still sliding in or already sliding out (not in its
  hold window)
- **THEN** the text card shows no content for that transition, and the
  card itself does not move, resize, or animate

### Requirement: Background glow matches the active phase
The stage's background glow SHALL be white during the Next.js and Other
(Three.js) phases and NestJS's red-pink brand color during the NestJS
phase, crossfading smoothly as scroll position moves between phases rather
than snapping abruptly at a phase boundary.

#### Scenario: Scrolling from Next.js into NestJS
- **WHEN** the user scrolls from the Next.js phase into the NestJS phase
- **THEN** the background glow smoothly transitions from white to
  red-pink as scroll position crosses the phase boundary

#### Scenario: Scrolling from NestJS into Other
- **WHEN** the user scrolls from the NestJS phase into the Other phase
- **THEN** the background glow smoothly transitions from red-pink back to
  white as scroll position crosses the phase boundary
