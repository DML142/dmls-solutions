## MODIFIED Requirements

### Requirement: Navbar stays hidden through Skills
The navbar SHALL remain hidden while scrolling through the rest of the
About lock/release range, then reappear in its dark theme once the user
reaches the Skills section, staying visible (dark) through the remainder
of the Skills scroll range. Once the user reaches the Contact section, the
navbar SHALL hide again and stay hidden for the rest of the scroll.
Scrolling back out of Contact into Skills SHALL restore it to visible/dark;
scrolling back out of Skills into the About lock/release range SHALL hide
it again; scrolling back above the hero-to-About trigger point SHALL
restore it to visible/light, per the existing hide/show requirement above.

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

#### Scenario: User scrolls from Skills into Contact
- **WHEN** the user continues scrolling past Skills into the Contact
  section
- **THEN** the navbar hides again and stays hidden for the rest of the
  scroll

#### Scenario: User scrolls back from Contact into Skills
- **WHEN** the user scrolls back from the Contact section into Skills
- **THEN** the navbar reappears in its dark theme, matching the behavior
  it had while Skills was in view
