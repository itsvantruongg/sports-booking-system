```markdown
# Design System Document

## 1. Overview & Creative North Star: "The Kinetic Gallery"
This design system moves away from the rigid, boxy nature of traditional sports booking platforms. Instead, it adopts **"The Kinetic Gallery"** as its Creative North Star. The goal is to blend the high-energy pulse of athletic performance with the refined clarity of a luxury editorial.

We achieve this through **Intentional Asymmetry** and **Bilateral Depth**. Rather than a standard grid, we use wide-open gutters and overlapping "floating" containers that suggest movement. The interface should feel like a premium lounge—spacious, authoritative, and frictionless—where the "Modern Professional" athlete feels both inspired and organized.

---

## 2. Colors & Surface Architecture
Our palette balances the "Vibrant Blue" of technical precision with the "Emerald Green" of natural turf and vitality. 

### Palette Strategy
*   **Primary (`#003ec7`):** Use for directional action and primary brand resonance.
*   **Secondary (`#006e2a`):** Use for success states, "Available Now" indicators, and secondary energetic accents.
*   **Background (`#fbf8ff`):** A slightly cooled white to prevent eye strain and feel more "custom" than pure #FFFFFF.

### The "No-Line" Rule
**Borders are forbidden for structural sectioning.** Boundaries must be defined through tonal shifts.
*   To separate a section, transition from `surface` to `surface-container-low`.
*   To highlight a specific area, use a `surface-container-highest` background rather than an outline.

### Glass & Gradient (The Soul)
To move beyond "flat" design, apply subtle linear gradients to primary CTAs:
*   **Signature Gradient:** `primary` (#003ec7) to `primary_container` (#0052ff) at a 135° angle.
*   **Glassmorphism:** For floating navigation or over-image filters, use `surface_container_lowest` at 70% opacity with a `24px` backdrop blur.

---

## 3. Typography: Editorial Authority
We utilize a pairing of **Plus Jakarta Sans** for high-impact displays and **Inter** for utility and body text.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Action" levels. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create a sense of urgency and power.
*   **Titles & Body (Inter):** These are our "Reliability" levels. `title-md` and `body-lg` ensure that booking details, times, and prices are hyper-readable.
*   **Hierarchy Tip:** Use `on_surface_variant` (#434656) for secondary metadata to create a sophisticated grey-scale contrast against the primary headlines.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "web 2.0." This design system uses **Tonal Layering** to create a physical sense of space.

### The Layering Principle
Stacking defines priority:
1.  **Base Layer:** `surface` (The "Field")
2.  **Section Layer:** `surface-container-low` (The "Court")
3.  **Content Card:** `surface-container-lowest` (The "Player Card")

### Ambient Shadows
Where a card requires a "lift" (e.g., a hovered booking slot), use an **Ambient Shadow**:
*   **Blur:** 40px - 60px
*   **Color:** `on_surface` (#191b25) at 6% opacity.
*   **Offset:** Y: 12px.

### The "Ghost Border" Fallback
If contrast is legally required for accessibility, use the `outline_variant` (#c3c5d9) at **15% opacity**. It should feel felt, not seen.

---

## 5. Components & Interaction Patterns

### Cards (The Core Pattern)
*   **Rules:** No dividers. Use `xl` (3rem) or `lg` (2rem) corner radii to create a friendly, approachable aesthetic. 
*   **Spacing:** Use a minimum of `2rem` (32px) internal padding to maintain the "high-end" feel.
*   **Nesting:** Place `surface-container-lowest` cards onto `surface-container` backgrounds to create natural separation without lines.

### Buttons
*   **Primary:** `primary` background with `on_primary` text. Radius: `full`. Use the Signature Gradient on hover.
*   **Secondary:** `secondary_fixed` background. This is our "Emerald" energy. Use for booking confirmations.
*   **Tertiary:** Transparent background with `primary` text. No border—only a `surface-variant` background on hover.

### Input Fields
*   **Base:** Large `md` (1.5rem) rounded corners. 
*   **State:** On focus, do not use a heavy border. Use a 2px "Ghost Border" and shift the background to `surface_bright`.

### Chips & Filters
*   Use `secondary_container` for active filters. The Emerald Green indicates an "Active/Selected" state, mimicking a green light or a field of play.

---

## 6. Do’s and Don'ts

### Do:
*   **Do** use asymmetrical layouts (e.g., a large headline on the left, with cards overlapping the right-hand gutter).
*   **Do** use large, high-action sports photography that "breaks" the container (overflow-visible) to create energy.
*   **Do** rely on the Typography Scale. A `display-lg` headline is your most powerful layout tool.

### Don’t:
*   **Don't** use 1px solid black or grey borders. This instantly "cheapens" the brand.
*   **Don't** use standard 4px or 8px rounded corners. Stick to the `lg` (2rem) and `xl` (3rem) scale to maintain the system's "soft-modern" signature.
*   **Don't** clutter. If you are unsure, add more `surface` space. High-end design is defined by what you leave out.

### Accessibility Note:
While we use soft tonal shifts, ensure that the `on_surface` to `surface` contrast ratio always meets WCAG AA standards. When using Emerald Green (`secondary`), ensure the text color is `on_secondary_container` (#00732c) for maximum legibility.```