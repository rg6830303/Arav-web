# Aravosh Frontend Redesign Design System

This document details the visual guidelines, design tokens, component specifications, and UX/UI patterns established for the **Aravosh Frontend Redesign** project. This design system ensures consistent layout, accessibility, and responsiveness across all pages.

---

## 1. Color Palette

The redesign implements a premium light-mode visual aesthetic based on cool, technical slate and blue tones. The palette is designed to avoid stark pure blacks and glowing neon AI styling in favor of crisp borders, high-contrast text, and subtle surface layering.

### Base Surfaces
* **Main Background (`bg-background`)**: `#f8f9fe` (Clean, off-white background with a slight cool blue cast)
* **Surface Containers**:
  * **Lowest (`bg-surface-container-lowest`)**: `#ffffff` (Used for primary cards, sidebars, and elements requiring separation)
  * **Low (`bg-surface-container-low`)**: `#f1f4fa` (Used for secondary section backgrounds and bento bock containers)
  * **Medium/Default (`bg-surface`)**: `#f8f9fe`
  * **High (`bg-surface-container-high`)**: `#e4e8f0` (Used for subtle borders, divider lines, and hover surfaces)
  * **Highest (`bg-surface-container-highest`)**: `#dee3eb` (Used for headers, footers, and structural boundaries)

### Brand Accent & Theme Colors
* **Primary Theme Accent (`primary`)**: `#396287` (Muted, professional slate-blue seed color)
* **Primary Container (`primary-container`)**: `#a8d0fa` (Light blue fill for primary tags, active highlights, and active stepper backgrounds)
* **Primary Dim (`primary-dim` / Hover state)**: `#2c567a` (Deep slate-blue for primary hover states)
* **Secondary Cool Accent (`secondary`)**: `#526070` (Muted slate-grey accent)
* **Secondary Container (`secondary-container`)**: `#d5e4f7` (Light slate fill for badges and tags)
* **Secondary Dim (`secondary-dim`)**: `#465564` (Cool slate-grey text accent)
* **Tertiary Soft Color (`tertiary`)**: `#5d5b84` (Deep purple-slate accent)
* **Tertiary Container (`tertiary-container`)**: `#c5c2f2` (Light purple accent fill)

### Text Typography Colors
* **On-Surface / On-Background (`text-on-surface`)**: `#2d333a` (High-contrast charcoal, satisfying WCAG AA legibility criteria)
* **On-Surface-Variant / Muted (`text-on-surface-variant`)**: `#5a6067` (Used for secondary descriptions, placeholders, and dates)
* **Inverse Surface (`inverse-surface`)**: `#0c0e12` (Dark charcoal contrast surface)

---

## 2. Typography Scale

The type scale establishes a strict hierarchy by separating bold, geometric display faces from highly legible body sans-serifs.

### Font Families
* **Headline & Display**: `Plus Jakarta Sans`, sans-serif (Geometric, high-impact sans-serif for brand headings, timeline labels, and card H3s)
* **Body Text**: `Inter`, sans-serif (Optimized for long-form reading, paragraphs, and lists)
* **Labels & Small Actions**: `Public Sans`, sans-serif (Used for navigation links, tags/chips, and form buttons)

### Font Scale and Hierarchy
* **Hero Title (H1)**: `text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]`
* **Section Heading (H2)**: `text-3xl md:text-4xl font-bold tracking-tight leading-tight`
* **Card Heading (H3)**: `text-xl md:text-2xl font-bold leading-snug`
* **Lead/Introduction**: `text-lg font-body leading-relaxed`
* **Standard Body**: `text-base font-body leading-relaxed` (Base text color `#2d333a`, line-height `1.65` for optimal reading flow)
* **Small Body / Secondary Text**: `text-sm font-body leading-normal`
* **Metadata / Labels**: `text-xs font-label uppercase tracking-widest`

---

## 3. Spacing System

The spacing system employs a unified mathematical grid to ensure consistent content breathing room and alignment.

* **Layout Margins**:
  * **Desktop**: `px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32`
  * **Mobile**: `px-4 py-12`
* **Container Bounds**: Max-width is capped at `max-w-7xl` (1280px) for layout grid components, or `max-w-6xl` (1152px) for centered text layouts.
* **Component Gaps**:
  * **Standard Grids (Bento, Cards)**: `gap-6` to `gap-8` (24px to 32px)
  * **Bento Small Sub-Items**: `gap-4` (16px)
  * **Sidebar List**: Vertical space `flex flex-col gap-2` (8px)

---

## 4. Border Radii

Borders feature rounded profiles to convey a premium, soft, yet structured product interface.

* **Primary Cards & Containers**: `rounded-2xl` (16px / 1rem) – Applied to capability cards, case studies, stepper containers, and direct contact widgets.
* **Secondary Elements**: `rounded-xl` (12px / 0.75rem) – Applied to image placeholders, code snippets, and bento blocks.
* **Selectable Options & Inputs**: `rounded-lg` (8px / 0.5rem) – Applied to text fields, form textareas, and project type options in the stepper.
* **Badges, Action Buttons & Menus**: `rounded-full` (9999px) – Applied to primary pill buttons, active status dots, and pill tags.

---

## 5. Shadows

Shadows are used sparingly to elevate interactive cards and emphasize the primary user workflow without cluttering the screen.

* **Standard elevation (`shadow-sm`)**: `box-shadow: 0 1px 2px rgba(23, 72, 110, 0.08);` – Applied to static cards, sidebar boundaries, and header bars.
* **Interactive hover elevation (`hover:shadow-lg`)**: `box-shadow: 0 28px 64px rgba(23, 72, 110, 0.18);` – Applied to cards, stepper choices, and primary action buttons on mouseover, creating a physical sense of depth.

---

## 6. Page Layouts

### Desktop Layout (Docked Sidebar)
* **App Shell Structure**: A fixed left-sidebar navigation drawer (`w-64 fixed h-screen top-0 left-0 border-r border-outline-variant bg-surface-container-lowest`).
* **Content Offset**: The main content wrapper spans full width and height with `md:ml-64` to offset the sidebar.
* **Section rhythm**: Sections are divided by a subtle border (`border-b border-surface-variant`) and use wide grid spacing.

### Mobile Layout (Top Navigation Bar)
* **App Shell Structure**: The sidebar collapses completely (`hidden`). A top-docked mobile nav bar handles primary brand presence (`fixed top-0 w-full z-50 bg-surface/80 border-b border-outline-variant h-16 backdrop-blur-md`).
* **Content Offset**: The main content is padded using `pt-20` to prevent layout overlaps.

---

## 7. Navigation Patterns

### Sidebar Navigation Link Structure
* **Passive State**: Flex link element containing an icon and text:
  `flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 font-label`
* **Active State**: Elevated and emphasized to provide a clear indicator:
  `flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-primary-container/20 group font-label`

---

## 8. Button Variants

### Primary Action Button (Pill Style)
* **Tailwind Class**: `bg-primary text-on-primary font-label font-semibold py-3 px-4 rounded-full hover:bg-primary-dim transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2`
* **UX Attributes**: Smooth transitions on color change, subtle scaling highlight on active click, trailing material icon.

### Secondary/Ghost Action Button
* **Tailwind Class**: `bg-surface-container text-on-surface hover:bg-surface-container-highest transition-all border border-outline-variant/30 px-8 py-4 rounded-full font-label font-semibold active:scale-95 flex items-center justify-center`

### Stepper Option Card Button (Selectable)
* **Tailwind Class**: `text-left p-5 rounded-lg border border-outline-variant hover:border-primary hover:bg-primary-container/10 transition-all duration-200 group flex flex-col h-full`
* **Active Style (`.service-card-active`)**: `border-color: #396287; background-color: rgba(168, 208, 250, 0.1);`

---

## 9. Input and Form Styles (Contact Stepper)

* **Inputs and Textareas**:
  * White background (`bg-white`), thin border outline (`border border-outline-variant`), rounded corners (`rounded-lg`), padded (`px-4 py-3`).
  * **Focus State**: Outline highlights with primary brand blue and a transparent halo ring (`outline-none border-primary ring-2 ring-primary/20`).
* **Validation States**:
  * **Success State**: Form success notifications utilize a soft teal/blue banner container with clear confirmation text.
  * **Error State**: Input fields feature a red border highlight (`border-error`) and show a small trailing error alert description (`text-error text-xs mt-1`).
  * **Disabled State**: Form submit button uses a progress cursor (`cursor-wait`), and inputs are set to `opacity-60` when waiting for API submissions.

---

## 10. Table and Card Styles

### Bento Grid / Info Cards
* **Container**: Low-level surface backing (`bg-surface-container-lowest`), subtle borders (`border-outline-variant/40`), and generous padding (`p-8`).
* **Bento Header Icons**: Housed in a soft container wrapper (`bg-primary-container/30` or `bg-tertiary-container/30`), utilizing primary text fill color (`text-primary` / `text-tertiary`).
* **Hover Interaction**: Cards smoothly translate up and expand borders (`hover:border-primary/50 hover:shadow-lg transition-all duration-300`).

---

## 11. Responsive Behaviour

Layouts smoothly adapt to screen width break-points via standard Tailwind utility flags:
* **Grid Layouts**:
  * Capabilities/Case Study Grid: Collapses from 3 columns on desktop (`md:grid-cols-3` / `lg:grid-cols-3`) to 1 column on tablet and mobile (`grid-cols-1`).
  * Tech Grid (Bento style): Spans `grid-cols-2` on mobile, `md:grid-cols-3` on tablet, and `lg:grid-cols-4` on desktop, with col-spans and row-spans to form a structured layout.
* **Layout Blocks**: Two-column hero sections align vertically on tablet and mobile viewports (`grid-cols-1 lg:grid-cols-2`).

---

## 12. Accessibility Rules

* **Text Contrast**: Text colors satisfy WCAG AA contrast ratio of at least 4.5:1 for standard body text (`#2d333a` on `#f8f9fe`).
* **Interactive Outlines**: Element focus states specify visible focus indicators (`focus-visible:ring-2 focus-visible:ring-primary`).
* **Screen Reader Assistance**: All decorative icons specify `aria-hidden="true"`, and standalone links specify descriptive `aria-label` attributes (e.g. `aria-label="Email Us"`).
