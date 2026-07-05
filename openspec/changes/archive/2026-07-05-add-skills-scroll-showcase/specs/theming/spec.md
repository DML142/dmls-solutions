## ADDED Requirements

### Requirement: Light/dark theme prop on shared chrome components
The global navbar and its contact call-to-action button SHALL each accept a
`theme` value of `"light"` or `"dark"` that selects between two distinct,
fully-defined color treatments (background, text, border, and any fill/wave
accent colors), defaulting to `"light"` when unspecified. Both components
SHALL be implemented so a future site-wide dark mode can reuse the same
`theme` prop rather than requiring separate component copies.

#### Scenario: Navbar rendered with the light theme
- **WHEN** the navbar is rendered with `theme="light"` (or no theme prop)
- **THEN** it displays with a white/light background and black/dark text,
  matching the existing Hero-section appearance

#### Scenario: Navbar rendered with the dark theme
- **WHEN** the navbar is rendered with `theme="dark"`
- **THEN** it displays with a dark background and light text, with no
  hardcoded light-theme colors leaking through

#### Scenario: Contact CTA button matches the active theme
- **WHEN** the contact call-to-action button is rendered with a given
  `theme` value
- **THEN** its border, fill/wave animation color, and text colors match that
  theme's palette, remaining legible against the navbar's background in
  both themes
