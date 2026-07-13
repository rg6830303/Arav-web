# UI Changes

Full findings and rationale are in `DESIGN_AUDIT.md`. This is the change log.

## 1. Before / after summary

Before: a generic "AI startup" template look layered on top of an earlier dark
theme that was never fully migrated — animated gradient blobs, a 3D glassmorphic
hero scene with a canvas particle sphere, scroll-fade-in on 20 elements, cursor-
tracking tilt on every card, an icon-circle on every feature, full-pill buttons,
and three unreconciled "accent" colors scattered through the stylesheet.

After: a single accent color used consistently everywhere; the decorative hero
scene replaced with a real, ranked list of what the business actually leads with
(AI agents/multi-agent systems first — the site's own stated priority order, not
previously reflected anywhere in the content); the repeated icon-card grid
replaced with one reusable ranked list component; all purely decorative motion
removed, with the remaining motion (scroll progress bar, timeline fill, tab
filtering, planner steps) kept because it communicates state or progress.

## 2. Design-system changes

- One accent (`--accent: #396287` + `--accent-rgb` for opacity variants) used
  everywhere; removed `--accent-2`, `--accent-3`, and three unused Material-style
  container tokens that were defined but never referenced.
- Added real semantic status tokens: `--color-success`/`--color-success-bg`,
  `--color-error`/`--color-error-bg`, replacing three inconsistent hardcoded reds
  and a stray blue used for "success" text.
- Added `--space-section`/`--space-section-sm` spacing tokens (previously section
  padding was hardcoded per breakpoint in 5 separate places).
- Added `--r-control` (10px) for buttons, distinct from `--r-pill` (kept only for
  small tags/filters).
- Buttons: primary/ghost hierarchy kept, moved off `border-radius: 9999px` to
  `--r-control`, removed the diagonal "shine sweep" hover animation.
- New reusable component: `.service-list` / `.service-row` (a ranked list with a
  number, name, and description) replaces the icon-circle `.card` grid, used on
  both the home page and the services page.
- New reusable component: `.priority-panel` / `.priority-row` for the hero's
  "what we lead with" panel.

## 3. Principal page-level changes (`build.mjs`)

- `SERVICES` array reordered to the actual business priority (AI agents/
  multi-agent → internal tooling/AI automation & RAG → software development →
  design → cloud → strategy). This order now drives the hero panel, the home
  page's 3-item preview, the full services list, and the JSON-LD offer catalog —
  previously "AI Automation" was buried third of six with no stated rationale.
- Home hero rewritten: removed the aurora/glow/3D-scene/particle-canvas/magnetic-
  button markup; new two-column layout pairs the headline with a real "what we
  lead with" ranked panel. Headline and subhead rewritten from generic ("we
  build technology that moves your business forward") to specific (states the
  actual priority order and the "scoped clearly before any estimate" promise
  already used elsewhere on the site).
- `card()`/`serviceCard()` (icon-circle) replaced with `serviceRow()`/
  `serviceList()` (ranked list, plain inline icon, no circular well).
- `ctaBand()` simplified: no glow blobs, no big rounded pill container, no
  redundant "Let's talk" eyebrow repeated on every page.
- `eyebrow` usage cut from 7 instances to a handful of intentional ones (the
  per-page kicker in `pageHead`, plus two page-specific subsection labels) —
  no longer on every section.
- 404 page: removed the `hero-grid`/`hero-glow` decorative wrapper and the
  gradient-shimmer "404" text; now a plain accent-colored numeral.
- `data-reveal`, `data-tilt`, `data-spot`, `data-magnetic`, `data-parallax`
  attributes removed from all markup (20+ elements).
- Added `#plannerStepError` (`role="alert"`) region to the contact page's
  project planner, wired to replace the old `alert()`-based validation.

## 4. Accessibility changes

- Fixed a real WCAG contrast failure: form `.field-error` text was `#ff9aa6`
  (light pink) on a white surface (~2:1) — now `#b3273f` (6.4:1, passes AA).
- Replaced `alert()`-based planner step validation with an inline, accessible
  `role="alert"` message consistent with the form's existing error pattern.
- Added focus management to the mobile sidebar drawer: opening moves focus into
  it, `Tab`/`Shift+Tab` are trapped inside while open, `Escape` closes it and
  returns focus to the toggle button. Previously a keyboard user could tab out
  of the open drawer into content hidden behind the backdrop.
- Global `prefers-reduced-motion: reduce` rule now suppresses all remaining
  animation/transition durations site-wide, replacing several scattered,
  incomplete per-component reduced-motion overrides.

## 5. Responsive changes

- Fixed a horizontal-overflow regression (introduced during the rewrite, caught
  during verification, not present in the final result): the topbar logo `<img
  width="1500" height="390">` was rendering at its literal HTML-attribute width
  because only `height` was constrained in CSS. Added `width: auto` to both logo
  rules. Verified zero overflow at 320/375/768/1024/1280/1440px.
- Removed the old "hide the whole hero visual below 540px" pattern — the new
  priority panel is real content, so it now stays visible and reflows to a
  single column on narrow screens instead of disappearing.
- Simplified the "Why" timeline from an alternating left/right zig-zag layout to
  a single left-aligned line, which reflows more predictably at narrow widths
  without the special-case mobile override the zig-zag version needed.

## 6. Performance changes

- Removed a continuous `requestAnimationFrame` loop (canvas particle-sphere,
  ~320 points recomputed every frame) that ran purely for hero decoration.
- Removed four separate `window`-level `pointermove` listeners (tilt, magnetic
  buttons, hero spotlight, 3D scene parallax) that fired on every pointer move
  across the entire page.
- Removed the count-up stats `IntersectionObserver` block — its `data-count`
  markup no longer existed anywhere in the generated HTML (dead code).
- `styles.css`: 1249 → 682 lines. `script.js`: 561 → ~350 lines.

## 7. Tests and commands run

- `node build.mjs` — succeeds, regenerates all 9 pages.
- `node --check build.mjs` / `node --check script.js` — syntax OK.
- No lint/typecheck/test suite exists in this repo (no `package.json`) — stated
  accurately rather than fabricating a result.
- Playwright (headless Chromium) against a local static server: all 9 routes
  checked for HTTP status and console/page errors; 6 breakpoints checked for
  horizontal overflow; tech-filter, FAQ accordion, planner validation/
  navigation, and mobile-drawer keyboard operation (including focus trap and
  focus return) verified interactively; WCAG AA contrast verified numerically
  for all primary text/background/status-color pairs actually used.

## 8. Known limitations

- Google Fonts loading itself could not be verified in this sandbox (network
  policy blocks `fonts.googleapis.com`); confirmed via the proxy's status
  endpoint that this is a sandbox network restriction, not a site defect.
- No Lighthouse/Core Web Vitals tooling available in this environment to
  produce measured LCP/INP/CLS numbers.
- No screen reader available to verify actual announcement behavior; ARIA
  state, focus order, and keyboard operability were verified via Playwright/DOM
  inspection instead.
- Google Fonts weight trimming was identified but not done (listed as optional
  in the audit).

## 9. Files with the most significant changes

- `styles.css` — full pass: token consolidation, removal of ~45% of the file
  (decorative rules + orphaned classes), new components.
- `build.mjs` — hero rewrite, service list/priority panel components, `SERVICES`
  reorder, CTA/eyebrow simplification, planner error region.
- `script.js` — removed 6 decorative/dead JS blocks, fixed `alert()` usage,
  added drawer focus management.
- `index.html`, `services.html` — most visibly changed pages (hero + service
  list replace the old grid/scene).
- `DESIGN_AUDIT.md` (new), `UI_CHANGES.md` (new).

## 10. Intentional patterns retained, and why

- The sidebar app-shell layout — distinctive, not a template default, works
  well responsively. Kept as-is.
- The tech-stack filter, "Why" timeline progress fill, scroll progress bar, and
  planner stepper — all real interactions that communicate state, filtering, or
  progress. Kept; only the decorative motion around them was removed.
- Small pill-shaped tags/filters (`.case-tag`, `.tech-tab`) — kept as pills,
  since that's a restrained, common convention for tags/filters, distinct from
  the "massive pill-shaped CTA button" pattern that was actually removed.
- Native `<details>/<summary>` FAQ accordion — zero-JS, accessible by default,
  already correctly wired to `FAQPage` JSON-LD from prior work. Untouched.
