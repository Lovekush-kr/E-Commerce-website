# Design Tokens

## Art direction
Create a premium, modern dark e-commerce experience inspired by the supplied reference image: vivid ruby pink transitions through magenta and Tyrian purple into dark plum and black. The site should feel distinctive but calm. Product photos and readable content take priority over decoration.

## Core palette

| Token | Value | Intended use |
|---|---|---|
| Ruby | `#E0115F` | Primary CTA emphasis, sale badges, selected states, focused highlights |
| Tyrian purple | `#66023C` | Main brand color, navigation accents, buttons, active surfaces |
| Near black | `#090509` | Main page background |
| Pure black | `#000000` | Occasional deepest surface |
| Deep plum | `#260017` | Secondary sections, panels, hero overlay |
| Dark purple | `#420027` | Cards and elevated surfaces |
| Muted magenta | `#A00065` | Decorative gradient accent, restrained hover effect |
| Soft white | `#F7F2F5` | Main text on dark surfaces |
| Muted gray | `#B8AEB5` | Secondary text, helper copy |
| Subtle border | `#452035` | Borders and dividers on dark surfaces |
| Success | `#68B984` | Order confirmation or successful actions |
| Error | `#FF6B83` | Validation and error messages |

The two required brand colors must not change: Tyrian purple `#66023C` and ruby `#E0115F`. If a color needs adjustment for contrast, add a new documented token instead of silently changing these values.

## CSS custom properties
Declare shared tokens in one global stylesheet, normally `src/index.css` or the existing global CSS file after repository inspection.

```css
:root {
  --color-ruby: #E0115F;
  --color-tyrian: #66023C;
  --color-bg: #090509;
  --color-surface: #260017;
  --color-surface-raised: #420027;
  --color-magenta: #A00065;
  --color-text: #F7F2F5;
  --color-text-muted: #B8AEB5;
  --color-border: #452035;
  --color-success: #68B984;
  --color-error: #FF6B83;
}
```

Use these tokens throughout the CSS instead of repeating arbitrary hex values. Add tokens only when they solve a real need.

## Typography
- Prefer `Inter` or `Manrope` if available; otherwise use `system-ui, -apple-system, "Segoe UI", sans-serif`.
- Body text should be comfortably readable, usually `1rem` with a line height around `1.5`.
- Use clear hierarchy for hero heading, section headings, product titles, prices, and supporting text.
- Avoid excessive uppercase text and overly thin font weights.
- If loading a Google Font remotely, include a sensible system fallback.

## Spacing scale
Use a consistent spacing scale, for example:
- `4px`: tiny icon/text separation
- `8px`: compact gaps
- `12px`: small component gaps
- `16px`: standard component spacing
- `24px`: card and section gaps
- `32px`: larger content spacing
- `48px`: section separation
- `64px`: large hero/desktop section spacing

Use CSS variables if a scale becomes helpful. Do not force every gap to match a token when a small exception improves the layout.

## Layout and breakpoints
- Main content should use a centered container with a reasonable maximum width (approximately `1200–1320px`).
- Use CSS Grid for product listings and Flexbox for rows, navigation, and card internals.
- Suggested breakpoints: `640px` mobile/large phone, `768px` tablet, `1024px` laptop, `1280px` wide desktop.
- These are guidelines; use content-driven responsive CSS rather than targeting every device individually.
- Prevent horizontal overflow and keep touch targets comfortable on mobile.

## Surfaces and cards
- Page background: near black.
- Secondary sections: deep plum or subtle near-black gradients.
- Product cards: dark surface, restrained border, consistent image area, clear title/price, visible purchase action.
- Use modest border radii, usually `8–16px`; avoid rounding every element heavily.
- Shadows should be subtle and help separate layers, not look like neon outlines.
- Product images should preserve their natural proportions with an appropriate `object-fit`.

## Buttons and controls
- Primary action: ruby or Tyrian-purple surface with readable text.
- Secondary action: dark surface with a subtle purple border.
- Provide visible hover, active, disabled, and `:focus-visible` states.
- Do not communicate status by color alone.
- Form fields should have clear labels, readable placeholder text, and visible validation messages.

## Hero background image
Use a simple, lightweight abstract visual: dark plum/black base, softly blurred ruby-magenta glow, and restrained flowing curves or geometric shapes. It should support the hero copy rather than compete with products. Prefer a properly licensed or generated local asset when practical. If remote, document its source and retain a CSS gradient fallback. Use a dark overlay if text contrast requires it. Avoid loading a large background image across every page.

## Motion
- Use brief transitions (roughly 150–250ms) for hover and focus feedback.
- Keep animation subtle and nonessential.
- Respect `prefers-reduced-motion`.
- Do not add animation libraries for simple CSS transitions.

## Accessibility
- Maintain readable contrast.
- Use semantic headings and buttons/links for their actual purpose.
- Include keyboard focus styles.
- Provide meaningful alt text for product images when available.
- Ensure controls have accessible labels.
- Do not use color as the only indication of errors or selection.

## Consistency rule
Before adding new styling, check whether a token or shared component already covers the need. Add a new token only when necessary and document it.
