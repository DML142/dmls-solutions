## MODIFIED Requirements

### Requirement: Navbar stays hidden through Skills
The navbar SHALL remain hidden while scrolling through the rest of the
About lock/release range, then reappear in its dark theme once the user
reaches the Skills section, staying visible (dark) for the remainder of
the Skills scroll range. Scrolling back out of Skills into the About
lock/release range SHALL hide it again; scrolling back above the
hero-to-About trigger point SHALL restore it to visible/light, per the
existing hide/show requirement above.

#### Scenario: User scrolls from About into Skills
- **WHEN** the user continues scrolling past the About section's release
  point into the Skills section
- **THEN** the navbar animates back into view using its dark theme

#### Scenario: User scrolls back from Skills into About
- **WHEN** the user scrolls back from the Skills section into the About
  lock/release range
- **THEN** the navbar hides again, matching the behavior it had before
  first reaching Skills

#### Scenario: User scrolls back from Skills to the top of the page
- **WHEN** the user scrolls back from the Skills section all the way above
  the hero-to-About trigger point
- **THEN** the navbar ends up visible in its light theme, matching its
  original Hero-section appearance
