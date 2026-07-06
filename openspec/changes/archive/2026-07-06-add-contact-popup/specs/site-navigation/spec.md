## MODIFIED Requirements

### Requirement: Global navbar links
The site SHALL display a fixed top navbar with links to Home, About me,
Skills, and Contact, plus a distinct call-to-action button for contacting
the site owner. The Home, About me, Skills, and Contact links SHALL all
scroll to their corresponding section. The call-to-action button SHALL
instead open the global contact popup.

#### Scenario: Navbar visible on initial load
- **WHEN** the page first loads at the top of the hero section
- **THEN** the navbar is visible, showing all four section links and the
  contact call-to-action

#### Scenario: Clicking Home, About me, Skills, or Contact
- **WHEN** the user clicks the Home, About me, Skills, or Contact nav link
- **THEN** the page scrolls to the corresponding section

#### Scenario: Clicking the contact call-to-action button
- **WHEN** the user clicks the navbar's contact call-to-action button
- **THEN** the contact popup opens; the page does not scroll
