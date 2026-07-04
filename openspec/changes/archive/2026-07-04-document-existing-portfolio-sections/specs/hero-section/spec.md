## ADDED Requirements

### Requirement: Interactive star field
The hero SHALL render a fullscreen canvas of black stars that spawn along the
user's pointer or touch path as it moves, each with a short randomized
lifetime, gravity-affected trajectory, and fading trail.

#### Scenario: Pointer movement spawns stars
- **WHEN** the user moves the mouse across the hero section
- **THEN** black star shapes spawn near the cursor position and fall away under
  simulated gravity, fading out over their individual lifetime

#### Scenario: Touch movement spawns stars
- **WHEN** the user drags a finger across the hero section on a touch device
- **THEN** the same star-spawning behavior occurs as with mouse movement

#### Scenario: Canvas matches viewport across resize and zoom
- **WHEN** the browser window is resized or the page is zoomed
- **THEN** the star canvas resizes to exactly match the new viewport dimensions
  and device pixel ratio without distorting existing stars

### Requirement: Intro text reveal
The hero SHALL animate its title and subtitle into view once on initial load,
without requiring any user interaction.

#### Scenario: Page loads
- **WHEN** the hero section first mounts
- **THEN** the title and subtitle animate in from a translated, transparent
  state to their resting position and full opacity

### Requirement: Pointer parallax tilt
The hero's central text block SHALL tilt in 3D toward the pointer position,
mirroring the same tilt behavior used by the About CRT scene.

#### Scenario: Pointer moves across the hero
- **WHEN** the pointer moves relative to the hero text block's center
- **THEN** the text block rotates toward the pointer, easing back to neutral
  when the pointer leaves

### Requirement: Scroll-fill arrow indicator
The hero SHALL show a down arrow whose fill animates in lockstep with the
first stretch of scroll, before the About hand-off begins.

#### Scenario: User scrolls from the top of the page
- **WHEN** the user scrolls down from the very top of the page
- **THEN** the arrow's fill sweeps from empty to full proportionally with
  scroll position, reversing smoothly if the user scrolls back up
