# site-navigation Specification

## Purpose
TBD - created by archiving change document-existing-portfolio-sections. Update Purpose after archive.
## Requirements
### Requirement: Global navbar links
The site SHALL display a fixed top navbar with links to Home, About me,
Skills, and Contact, plus a distinct call-to-action button for contacting
the site owner.

#### Scenario: Navbar visible on initial load
- **WHEN** the page first loads at the top of the hero section
- **THEN** the navbar is visible, showing all four section links and the
  contact call-to-action

### Requirement: Navbar hides during the About section
The global navbar SHALL hide itself once the About CRT monitor has raised
over the hero, and SHALL reappear once the user scrolls back above that
point.

#### Scenario: About raises over the hero
- **WHEN** the user scrolls past the hero-to-About trigger point
- **THEN** the navbar animates upward out of view in sync with the About
  monitor's raise animation

#### Scenario: User scrolls back to the hero
- **WHEN** the user scrolls back up above the hero-to-About trigger point
- **THEN** the navbar animates back down into view in sync with About
  lowering back behind the hero

### Requirement: Navbar stays hidden through Skills
The navbar SHALL remain hidden for the rest of the scroll (through the About
lock/release and into Skills) once it has hidden, only reappearing when the
user scrolls back above the hero-to-About trigger point.

#### Scenario: User scrolls from About into Skills
- **WHEN** the user continues scrolling past the About section into Skills
- **THEN** the navbar remains hidden and does not reappear

