---
name: Editorial Voyage
colors:
  surface: '#fef9ef'
  surface-dim: '#dedad0'
  surface-bright: '#fef9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e9'
  surface-container: '#f2ede3'
  surface-container-high: '#ece8de'
  surface-container-highest: '#e7e2d8'
  on-surface: '#1d1c16'
  on-surface-variant: '#44474d'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f5f0e6'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#4b5f7f'
  primary: '#000d20'
  on-primary: '#ffffff'
  primary-container: '#0b233f'
  on-primary-container: '#768bac'
  inverse-primary: '#b2c8ec'
  secondary: '#006973'
  on-secondary: '#ffffff'
  secondary-container: '#89effd'
  on-secondary-container: '#006d78'
  tertiary: '#210300'
  on-tertiary: '#ffffff'
  tertiary-container: '#480c00'
  on-tertiary-container: '#da684a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#b2c8ec'
  on-primary-fixed: '#031c38'
  on-primary-fixed-variant: '#334866'
  secondary-fixed: '#90f1ff'
  secondary-fixed-dim: '#6ed5e3'
  on-secondary-fixed: '#001f23'
  on-secondary-fixed-variant: '#004f57'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb4a1'
  on-tertiary-fixed: '#3c0800'
  on-tertiary-fixed-variant: '#82280e'
  background: '#fef9ef'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d8'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-eyebrow:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.12em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the sophistication of an editorial travel publication fused with the responsive utility of a bespoke holiday concierge. Designed specifically for contemporary Indian travelers seeking curated domestic and global adventures, the aesthetic communicates refined curation, personal attention, and wanderlust.

The design movement combines **Contemporary Editorial** with **Atmospheric Layering**:
- **Editorial Richness:** High-contrast serif headlines paired with italicized accent phrases evoke classic travel magazines (such as Condé Nast Traveller or National Geographic Traveller).
- **Modern Utilitarian Structure:** Frictionless travel search, dynamic package builders, and itinerary schedules rely on clean, neutral interface elements.
- **Cinematic Atmosphere:** Full-bleed imagery, golden-hour warmth, and layered translucent scrims create emotional resonance without sacrificing visual hierarchy or accessibility.

## Colors

The palette balances maritime depth, coastal warmth, and vibrant celebratory accents:

- **Primary (`#0B233F` — Deep Navy):** Represents authority, maritime heritage, and premium travel design. Used for primary typography, navigation bars, structural dark-mode containers, and luxury card backdrops.
- **Secondary (`#078E9B` — Ocean Teal):** Evokes azure coastlines and tranquil waters. Applied to active states, inline text links, progress rings, and secondary badge highlights.
- **Tertiary (`#F47C5C` — Sunset Coral):** Reserved strictly as an action-driving accent. Applied to high-intent conversions ("Plan My Trip", "Request Custom Itinerary"), limited-time perks, and active focus triggers.
- **Neutral (`#F7F2E8` — Warm Sand):** The primary off-white backdrop foundation that keeps the reading experience soft and welcoming, avoiding sterile tech-white canvases.
- **Surface & Chrome (`#FFFFFF`):** High-elevation cards, modals, and content containers.
- **Text & Borders:** Body copy renders in refined charcoal (`#2D3748` for primary body, `#4A5568` for secondary captions). Subtle hairpins and dividers use soft sand-slate (`rgba(11, 35, 63, 0.08)` or `#E2E8F0`).

## Typography

The typographic hierarchy juxtaposes literary serif artistry with clinical sans-serif utility:

- **Headlines & Editorial Callouts:** Handled exclusively by `Playfair Display`. Display titles frequently leverage italic styling on evocative keywords (e.g., *Untamed* Ladakh, *Timeless* Amalfi) to reinforce magazine flair.
- **Eyebrows & Micro-Headers:** Set in `Inter` uppercase (`label-eyebrow`) with wide tracking (`0.12em`) to introduce destinations, category groupings, and journey durations with precision.
- **Body & Data Displays:** Set in `Inter` for optimal legibility across mobile package itineraries, day-by-day timelines, and booking forms.

## Layout & Spacing

The layout employs a responsive 12-column grid system anchored to a max-width container of `1280px` for structured desktop viewing, with edge-to-edge breakout sections for high-impact travel photography.

- **Breakpoints:**
  - **Mobile:** `< 768px` — 4-column layout, horizontal edge-swiping cards, `margin-mobile` of `1.25rem`.
  - **Tablet:** `768px – 1024px` — 8-column layout, `gutter` of `1.25rem`, `margin` of `2rem`.
  - **Desktop:** `> 1024px` — 12-column layout, `gutter` of `1.5rem`, outer `margin` of `4rem`.
- **Rhythm & Whitespace:** Generous vertical rhythm separates narrative editorial essays from structured pricing cards. Sections breathe with `space-xl` and larger dynamic paddings, preventing cognitive overload during complex vacation planning.

## Elevation & Depth

Depth is established through soft ambient warmth and atmospheric translucency, eliminating stark digital drop shadows in favor of natural sunlight metaphors:

- **Atmospheric Shadows:** Shadows are extra-diffused with navy tinting rather than harsh black (`0 8px 30px rgba(11, 35, 63, 0.06)` for default cards; `0 20px 40px rgba(11, 35, 63, 0.12)` for floating booking docks and hover states).
- **Cinematic Scrims:** Full-bleed image containers employ a directional gradient scrim (`linear-gradient(180deg, rgba(11,35,63,0) 40%, rgba(11,35,63,0.85) 100%)`) to guarantee high-contrast readability for white headlines placed over destination photography.
- **Glassmorphic Navigation & Floats:** Top application bars and sticky quotation summaries utilize `backdrop-filter: blur(12px)` over `rgba(247, 242, 232, 0.85)` or `rgba(255, 255, 255, 0.9)`.

## Shapes

The shape system blends structured cards with organic, tactile interaction targets:

- **Cards & Modals:** Built with a consistent `16px` border-radius (`rounded-lg`), delivering a modern, tailored framing that flatters travel imagery.
- **Action Elements & Chips:** Buttons, category selection tags, search inputs, and day badges utilize full pill-shaped radiuses (`9999px`), encouraging touch and providing ergonomic visual contrast against rectangular itinerary blocks.
- **Dividers & Outlines:** Low-contrast outlines at `1px solid rgba(11, 35, 63, 0.08)` ground cards without competing with high-vibrancy photography.

## Components

### Buttons
- **Primary Action ("Plan My Trip"):** Pill-shaped, tertiary Sunset Coral (`#F47C5C`) background, white text, subtle hover lift, accompanied by an interactive forward arrow icon.
- **Secondary Button:** Deep Navy (`#0B233F`) solid fill with white text, or Ocean Teal (`#078E9B`) text with an ultra-thin border (`rgba(7, 142, 155, 0.3)`) and subtle sand fill on hover.
- **Ghost/Editorial Link:** High-contrast underline link with an italicized hover transition and trailing directional glyph.

### Cards & Modules
- **Destination & Package Cards:** Surface White (`#FFFFFF`) or Warm Sand (`#F7F2E8`) containers with `16px` radius. Features a 4:3 or 16:9 golden-hour hero visual, duration chip pinned top-left, and transparent bookmark icon top-right. Typography leads with an editorial destination title over concise pricing summaries.
- **Itinerary Timeline Cards:** Vertical continuous spine connected by Ocean Teal nodes, featuring expandable morning/afternoon/evening segments on subtle white cards with faint neutral borders.

### Chips & Filter Tags
- **Pill Badges:** Fully rounded (`rounded-full`), padded with `0.5rem 1rem`. Unselected state uses Warm Sand (`#F7F2E8`) background with Charcoal text. Selected state transforms into Deep Navy with white text or Ocean Teal with soft teal fill.

### Input Fields & Search Bars
- **Trip Inquiry Inputs:** Pill or soft-cornered fields (`rounded-md` to `rounded-full`) with Warm Sand backgrounds, Charcoal text, and an active focus ring in Ocean Teal (`0 0 0 2px rgba(7, 142, 155, 0.4)`). Floating labels utilize `label-eyebrow` styling.

### Checkboxes & Radio Buttons
- **Selection Controls:** Custom circular radios and rounded checkboxes with Deep Navy active fills and crisp white iconography. Multi-destination select options present card-level border shifts from neutral to Ocean Teal when checked.

### Custom Component: Curated Itinerary Scrubber
- Sticky bottom/side dock featuring travel agent avatar, direct WhatsApp/Call concierge toggle, and live customized package price counter with high-visibility Coral CTA.