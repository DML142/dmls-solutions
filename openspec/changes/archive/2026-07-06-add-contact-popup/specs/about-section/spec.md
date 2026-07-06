## MODIFIED Requirements

### Requirement: In-scene navigation menu
The About scene SHALL render its own HOME / ABOUT / SKILLS / CONTACT menu
inside the WebGL canvas (subject to the same CRT shader as the rest of the
scene), where hovering a button fills it green from left to right with the
label switching to black text, and clicking any of the four buttons
scrolls to its corresponding section.

#### Scenario: Hovering a menu button
- **WHEN** the pointer hovers over one of the in-scene menu buttons
- **THEN** that button's background fills with green from left to right and
  its label color switches to black

#### Scenario: Clicking any menu button
- **WHEN** the user clicks the HOME, ABOUT, SKILLS, or CONTACT menu button
- **THEN** the page scrolls to the corresponding section
