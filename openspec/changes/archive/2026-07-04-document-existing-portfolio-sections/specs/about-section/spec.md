## ADDED Requirements

### Requirement: CRT monitor visual effect
The About section SHALL render its WebGL screen content through a
postprocessing shader that simulates an old CRT terminal: barrel distortion
of the image, horizontal scanlines, a green phosphor tint, a vignette, and a
retrace band that periodically sweeps top-to-bottom. Only the WebGL screen
content SHALL be warped; the DOM monitor bezel SHALL remain undistorted.

#### Scenario: About section is visible
- **WHEN** the About monitor is raised and visible
- **THEN** its screen content shows barrel distortion, scanlines, a green
  phosphor tint, and a vignette, while the surrounding bezel stays a crisp,
  undistorted rectangle

#### Scenario: Retrace band cycle
- **WHEN** the About section remains visible over time
- **THEN** a bright/dark band periodically sweeps from the top of the screen
  to the bottom and repeats

### Requirement: Monitor bezel realism
The monitor bezel SHALL be built from DOM/CSS (gradients and inset/outset
shadows) to read as a convex plastic shell with a concave inner recess, not
the WebGL canvas — so it is never affected by the CRT shader.

#### Scenario: Bezel renders around the screen
- **WHEN** the About section is visible
- **THEN** the bezel appears as a 3D plastic frame with light/shadow gradients
  distinct from the shader-warped screen content it surrounds

### Requirement: In-scene navigation menu
The About scene SHALL render its own HOME / ABOUT / SKILLS / CONTACT menu
inside the WebGL canvas (subject to the same CRT shader as the rest of the
scene), where hovering a button fills it green from left to right with the
label switching to black text, and clicking scrolls to the corresponding
section.

#### Scenario: Hovering a menu button
- **WHEN** the pointer hovers over one of the in-scene menu buttons
- **THEN** that button's background fills with green from left to right and
  its label color switches to black

#### Scenario: Clicking a built section's menu button
- **WHEN** the user clicks the HOME or ABOUT menu button
- **THEN** the page scrolls to the corresponding section

#### Scenario: Clicking a not-yet-built section's menu button
- **WHEN** the user clicks the SKILLS or CONTACT menu button before those
  sections exist in the scroll flow
- **THEN** the click has no effect (no navigation, no error)

### Requirement: Bio content and pointer tilt
The About scene SHALL display the site owner's bio text inside a bordered
terminal-style box, and the whole scene SHALL tilt toward the pointer (or
touch position), matching the hero's parallax behavior.

#### Scenario: Bio box renders
- **WHEN** the About section is visible
- **THEN** the bio text is shown inside a green-bordered terminal box with a
  `> about_me.txt` label above it

#### Scenario: Pointer or touch moves
- **WHEN** the pointer or a touch point moves across the screen
- **THEN** the About scene tilts gently toward that position

### Requirement: Scroll-down indicator
The About scene SHALL show a blocky pixel-art down arrow near the bottom of
the screen that bounces between exactly two frames with a hard cut (no
easing), rendered inside the WebGL canvas so the CRT shader affects it like
the rest of the scene.

#### Scenario: Arrow animates over time
- **WHEN** the About section is visible
- **THEN** the arrow's vertical position alternates between two fixed offsets
  on a fixed interval, with no eased transition between them

### Requirement: Scroll hand-off into Skills
The About monitor SHALL auto-raise over the hero once the user scrolls past a
trigger point, stay pinned in place for a further scroll distance, and then
release into native browser scrolling so the user can continue scrolling
down into the Skills section. Scrolling back up SHALL reverse the same
sequence.

#### Scenario: Scrolling past the trigger point
- **WHEN** the user scrolls past the hero-to-About trigger point
- **THEN** the About monitor animates into full view over the hero and the
  global navbar hides, without requiring the user to keep scrolling during
  that animation

#### Scenario: Scrolling through the locked range
- **WHEN** the user continues scrolling within the post-raise lock distance
- **THEN** the About monitor remains fully visible and unchanged

#### Scenario: Scrolling past the release point
- **WHEN** the user scrolls past the end of the lock distance
- **THEN** the About monitor releases into normal document scrolling and the
  Skills section becomes reachable by continuing to scroll down, with no
  visible gap or flash of the hero section between About and Skills

#### Scenario: Fast scrolling through the whole sequence
- **WHEN** the user scrolls very quickly, crossing the raise trigger and the
  release point within the same interaction
- **THEN** the About monitor still ends up fully visible and correctly
  positioned, never disappearing or rendering off-screen

#### Scenario: Scrolling back up from Skills
- **WHEN** the user scrolls back up from the Skills section through the
  locked range and past the original trigger point
- **THEN** the About monitor re-locks, then lowers back behind the hero, and
  the navbar reappears, mirroring the forward sequence in reverse

### Requirement: Responsive layout across screen sizes
The About scene's content (menu, bio box, scroll arrow) SHALL scale down
together to fit whichever screen dimension — width or height — is more
constraining, so content never overlaps regardless of window shape.

#### Scenario: Short, wide desktop window
- **WHEN** the browser window is wide but has limited vertical height
- **THEN** the menu, bio box, and arrow all shrink together and remain fully
  visible without overlapping each other

#### Scenario: Narrow mobile viewport
- **WHEN** the About section is viewed on a narrow mobile screen
- **THEN** the CRT screen fills the full viewport (not letterboxed) and its
  content remains legible and non-overlapping
