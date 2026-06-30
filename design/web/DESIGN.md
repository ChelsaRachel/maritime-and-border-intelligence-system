# Tactical — Style Reference
> A command interface design system — dense, compact, and high-precision. No excessive decoration, no radius, no noisy color. Hierarchy is built from typography, spacing, and iconography — not color.

**Theme:** dark

Tactical is a command interface — every decision is load-bearing. The surface stack is lean and deliberate (`bg-background-primary` → `bg-background-secondary`): two steps, no more. No radius — corners are square, surfaces are flat, edges are hard. Color does not carry hierarchy — Montserrat's weight range (`font-regular` → `font-bold`) and spatial rhythm do. `primary` appears only where action is required: CTAs, active states, and critical data callouts. All other color is semantic — state, category, data series — never decorative. The result is a UI that communicates at a glance and gets out of the way.

---

## Colors

> Hex values listed for reference only. Never hardcode in implementation — always use the Tailwind token.

### Surface

| Name | Hex (info) | Tailwind Token | Role |
|------|-----------|----------------|------|
| Void | `#06080c` | `bg-background-primary` | Main page background — the canvas all panels sit on |
| Panel | `#171a1f` | `bg-background-secondary` | Generic elevated surface — base token; prefer semantic aliases below |
| Card | `#171a1f` | `bg-card` | Cards, stat blocks, widget containers, data panels |
| Sidebar | `#171a1f` | `bg-sidebar` | Sidebar nav container |
| Wire | `#232426` | `border-border-primary` | All borders and dividers — the single border tone across all components |
| Wire Secondary | — | `border-border-secondary` | Stronger emphasis borders, focus rings |

### Brand

> Each brand ramp has five stops: `light` → `soft` → `base` → `bold` → `deep`.

| Brand | Name | Base Hex (info) | Token Prefix | Role |
|-------|------|----------------|--------------|------|
| Primary | Biru Muda | `#60C8F0` | `primary-*` | Main CTA, active states, data callouts — the system's sole primary accent |
| Secondary | Hijau Teal | `#2EA38C` | `secondary-*` | Supporting actions, chart series 2, secondary data highlights |
| Tertiary | Kuning Amber | `#FFB81F` | `tertiary-*` | Warning-adjacent highlights, chart series 3, attention callouts |
| Quaternary | Oranye | `#FF6433` | `quaternary-*` | Chart series 4, heat indicators, high-priority labels |
| Quinary | Ungu | `#8E44AD` | `quinary-*` | Chart series 5, categorical grouping, advanced/admin indicators |

Token usage pattern: `bg-{brand}-{stop}` / `text-{brand}-{stop}` / `border-{brand}-{stop}`

Example: `bg-primary`, `text-secondary-bold`, `border-tertiary-soft`

#### Neutral Colors

`bg-neutral-light / soft / base / bold / deep` — same pattern.

### State Colors (bg / text / border)

| State | Grades |
|-------|--------|
| success | `*-success-light / soft / base / bold / deep` |
| error | `*-error-light / soft / base / bold / deep` |
| warning | `*-warning-light / soft / base / bold / deep` |
| info | `*-info-light / soft / base / bold / deep` |

| State | Role |
|-------|------|
| `success-*` | Positive trend indicators, completed status, success toasts |
| `error-*` | Danger/destructive actions, critical alerts, error badges, form validation |
| `warning-*` | Caution states, elevated thresholds, degraded performance indicators |
| `info-*` | Informational states, neutral data callouts, help text emphasis |

### Text

| Token | Role |
|-------|------|
| `text-font-primary` | Default text — body, headings, table data |
| `text-font-secondary` | Muted copy, captions, table headers, helper labels |
| `text-font-placeholder` | Input placeholder text |
| `text-font-disabled` | Disabled input and control labels |
| `text-font-on-accent` | Text on filled `primary` or accent backgrounds |

---

## Typography

### Montserrat — The sole typeface across the entire system. Every badge, button, nav link, heading, body copy, and metric label uses Montserrat. Its weight range drives all typographic hierarchy without family-switching. At display sizes, `font-bold` feels decisive and data-authoritative; at label sizes, `font-medium` keeps dense labels readable at compact density.

- **Substitute:** Montserrat
- **Weights:** `font-regular` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)
- **Base size:** `text-body-lg` (16px)
- **Line height:** `leading-tight` at display/metric sizes, `leading-normal` at body sizes
- **Letter spacing:** `tracking-normal` across all sizes

### Type Scale

| Role | Size Token | Size | Weight Token | Line Height Token |
|------|-----------|------|--------------|-------------------|
| Caption / badge | `text-label-sm` | 12px | `font-regular` | `leading-snug` |
| Label | `text-label-md` | 14px | `font-medium` | `leading-snug` |
| Body small | `text-body-sm` | 12px | `font-regular` | `leading-normal` |
| Body | `text-body-lg` | 16px | `font-regular` | `leading-relaxed` |
| Subheading | `text-h6` | 18px | `font-semibold` | `leading-snug` |
| Heading small | `text-h5` | 20px | `font-semibold` | `leading-tight` |
| Heading | `text-h4` | 24px | `font-bold` | `leading-tight` |
| Metric | `text-h2` | 36px | `font-bold` | `leading-tight` |
| Display | `text-display` | 60px | `font-bold` | `leading-none` |

---

## Spacing & Layout

**Base unit:** `spacing-2` (8px)

**Density:** compact

- **Page width:** conditional — full width for map/canvas pages; `max-w-7xl mx-auto` for all other pages
- **Section gap:** `gap-6`
- **Card padding:** none on container — padding lives on card header (`px-5 py-4`) and card body (`px-5 py-4`)
- **Element gap:** `gap-2`
- **Sidebar width:** 240px expanded / 60px collapsed

---

## Components

### Primary Button
**Role:** Main CTA — Save, Confirm, Apply filter, Export

`bg-primary text-font-on-accent font-sans text-body-sm font-semibold px-4 py-2.5`

Hover → `hover:bg-primary-bold`. No shadow. The `primary` fill on a dark canvas is the system's only chromatic action signal — never repurpose for decorative use.

### Border Button
**Role:** Secondary actions, cancel, adjacent controls

`bg-background-primary border border-border-primary text-font-primary px-4 py-2.5`

Reads as a ghost on `bg-background-secondary` surfaces.

### Destructive Button
**Role:** Delete, remove, terminate operations

`bg-error text-font-primary px-4 py-2.5`

Hover → `hover:bg-error-bold`. Use only for irreversible actions.

### Ghost Button
**Role:** Inline tertiary actions, icon-only controls

`text-primary` — no background, no border. Padding matches surrounding element density. Use for table row actions, sidebar links.

### Segmented Button / Timeframe Toggle
**Role:** Mutually exclusive filter or timeframe selection — a group of inline buttons where exactly one is active at a time

Base (inactive): `px-3 py-1.5 text-label-sm font-medium border border-border-primary text-font-secondary`

Active: `px-3 py-1.5 text-label-sm font-semibold border border-primary bg-primary text-font-on-accent`

Borders collapse between siblings (`border-left:none` on all but the first). No radius. JS toggles active by swapping inactive → active classes. Use for date ranges, view modes, category filters.

### Panel Card
**Role:** Stat blocks, data tables, form sections, widget containers

Container: `bg-card border border-border-primary` — no padding on the container itself.

Card header: `px-5 py-4` — no border-b by default; add `border-b border-border-primary` only when explicit separation from the body is needed.
Card body: `px-5 py-4`
Card footer: `px-5 py-4 border-t border-border-primary`

No shadow. The single elevated surface above the canvas — all dashboard content lives here.

### Metric Block
**Role:** Key KPI callouts — counts, percentages, status numerics

Large numeral: `text-h2 font-bold text-font-primary`. Label above: `text-label-md font-medium text-font-secondary`. Optional trend indicator (arrow icon + delta value) at `text-label-md`: `text-primary` (positive) or `text-error` (negative). Sits inside a Panel Card.

### Data Table
**Role:** Structured tabular data — the primary information display organism

- Header row: `text-label-md font-semibold text-font-secondary`
- Body rows: `text-body-lg font-regular text-font-primary`
- Row dividers: `border-b border-border-primary`
- Row hover: `hover:bg-muted`
- Selected row: `border-l-2 border-primary`

Alternating rows not recommended — rely on divider lines only.

### Sidebar / Nav
**Role:** Primary navigation container

`bg-sidebar border-r border-border-primary` — fixed width 240px (collapsed: 60px icon-only).

- Nav links inactive: `text-body-lg font-medium text-font-secondary`
- Nav links active: `text-primary bg-primary-soft border-l-2 border-primary`

### Badge / Status Chip
**Role:** Inline state labels — semantic states and categorical brand labels


Base classes applied to every badge regardless of variant: `text-label-sm font-medium px-1.5 py-0.5`

Two styles:

**Accent** (muted bg — use for subtle in-table or inline states):

| Variant | Classes |
|---------|---------|
| Primary / active | `bg-primary text-font-on-accent font-medium` |
| Secondary | `bg-secondary-light text-secondary-bold font-medium` |
| Tertiary | `bg-tertiary-light text-tertiary font-medium` |
| Quaternary | `bg-quaternary-light text-quaternary font-medium` |
| Quinary | `bg-quinary-light text-quinary font-medium` |
| Success | `bg-success-light text-success font-medium` |
| Error | `bg-error-light text-error-bold font-medium` |
| Warning | `bg-warning-light text-warning font-medium` |
| Info | `bg-info-light text-info font-medium` |
| Neutral | `bg-neutral-soft text-font-secondary font-medium` |

**Filled** (solid bg — use for prominent standalone badges):

| Variant | Classes |
|---------|---------|
| Primary | `bg-primary text-font-on-accent font-medium` |
| Secondary | `bg-secondary text-font-on-accent font-medium` |
| Tertiary | `bg-tertiary text-font-on-accent font-medium` |
| Quaternary | `bg-quaternary text-font-on-accent font-medium` |
| Quinary | `bg-quinary text-font-on-accent font-medium` |
| Success | `bg-success text-font-on-accent font-medium` |
| Error | `bg-error text-font-primary font-medium` |
| Warning | `bg-warning text-font-on-accent font-medium` |
| Info | `bg-info text-font-on-accent font-medium` |

### Input Field
**Role:** All form inputs, search fields, filter controls

`bg-background-secondary border border-border-primary px-3 py-2.5 font-sans text-body-lg font-regular text-font-primary placeholder:text-font-placeholder`

- Focus: `focus:border-primary focus:outline-none`
- Destructive: `border-error-soft`
- Optional left icon at 18px, `text-font-secondary`

### Alert / Toast
**Role:** System feedback — success, warning, error, info notifications

| Variant | Classes |
|---------|---------|
| Success | `bg-success-light border-success-soft text-success` |
| Error | `bg-error-light border-error-soft text-error` |
| Warning | `bg-warning-light border-warning-soft text-warning` |
| Info | `bg-info-light border-info-soft text-info` |

Title: `text-body-lg font-semibold`. Body: `text-body-sm font-regular text-font-secondary`. Semantic icon at 20px, inline left.

### Tab Bar
**Role:** In-panel content switching — Overview / Details / History

- Active: `border-b-2 border-primary text-font-primary font-semibold`
- Inactive: `text-font-secondary font-medium`

No pill shape — linear underline only. Spacing: `py-2.5 gap-4`.

### Header / Top Bar
**Role:** Global page-level nav strip

`bg-background-secondary border-b border-border-primary h-14`

- Left: wordmark or breadcrumb — `text-body-lg font-semibold text-font-primary`
- Center: optional search input
- Right: icon actions (`text-font-secondary`) + Primary Button

---

## Do's and Don'ts

### Do
- Use `bg-card` for all card and panel surfaces, `bg-sidebar` for sidebar/nav containers — these semantic tokens alias `bg-background-secondary` but express intent clearly. Never use `bg-background-secondary` directly on cards or sidebars.
- Apply `primary` exclusively to primary actions, active states, and key data highlights — its discipline makes it land as a meaningful signal, not decoration.
- Use `font-regular` for all body and table data, `font-semibold`–`font-bold` for headings, labels, and metric values — weight drives hierarchy, not size jumps.
- Never use radius — all corners are square. This is the system's most uncompromising surface rule.
- Use icons consistently — regular weight for nav and inputs, bold for button icons, fill for status/badge icons, duotone for alerts.
- Maintain a 2-step surface stack (`background-primary` → `background-secondary`) per view — never introduce more than two background tones in a single section.
- Use `text-font-secondary` for all secondary text — captions, table headers, label copy, placeholder text.

### Don't
- Don't use `primary` as a card background, decoration, or repeated highlight — scarcity is its power; overuse collapses its signal value.
- Don't add radius anywhere — no `rounded-*` on cards, buttons, inputs, badges, or modals. Square corners are non-negotiable.
- Don't introduce a second typeface — Montserrat's weight range handles all hierarchy; adding a second family destroys the single-voice typographic system.
- Don't apply `shadow-*` to cards — depth is expressed through background color steps (`background-primary` → `background-secondary`), never elevation shadows.
- Don't use color for decorative purposes — every color must encode a semantic or functional state. No chromatic accents for visual variety.
- Don't place body text at `text-label-sm` or below — compact density is achieved through tight spacing and weight hierarchy, not reduced font sizes.
- **Never use Tailwind opacity modifiers on color tokens** (`bg-error/15`, `bg-primary/10`, `border-primary/30`, etc.) — these are ad-hoc values that bypass the design system. Always use the designated semantic scale instead: `bg-error-light`, `bg-primary-soft`, `border-error-soft`, etc. If a semantic token doesn't exist for the use-case, add one to `variable.css` first.

---

## Elevation

All depth is expressed through background color steps — no `shadow-*` on cards.

| Level | Tailwind Classes | Notes |
|-------|-----------------|-------|
| Canvas | `bg-background-primary` | Absolute base, never a card background |
| Card | `bg-card border border-border-primary` | Cards, stat blocks, modals, panel containers |
| Sidebar | `bg-sidebar border-r border-border-primary` | Sidebar nav, header top bar |
| Row hover | `hover:bg-muted` | Ephemeral state on table rows and nav links |
| Active nav | `bg-primary-soft border-l-2 border-primary` | Persistent active-link surface |
| Input focus | `focus:border-primary` | Border change only — no shadow |
| Modal overlay | `bg-background-primary/70` | Backdrop behind dialogs |

---

## Surfaces

| Surface | Token | Notes |
|---------|-------|-------|
| Canvas | `bg-background-primary` | Page background — all panels sit on this |
| Card | `bg-card` | Cards, stat blocks, widget containers, modals |
| Sidebar | `bg-sidebar` | Sidebar nav container, top header bar |
| Muted / hover | `bg-muted` | Table row hover, nav link hover |
| Active nav fill | `bg-primary-soft` | Behind active sidebar nav items |

---


## Layout

Full-bleed `bg-background-primary` canvas. Sidebar fixed-left 240px (collapsed: 60px); top header sticky at `h-14`. Primary layout: sidebar + content area split. Dashboard content areas use 12-column or `grid-cols-[repeat(auto-fit,minmax(240px,1fr))]` with `gap-4` to `gap-6`. Section vertical gaps `gap-6`; card container has no padding — padding is on header (`px-5 py-4`) and body (`px-5 py-4`) sections. Data tables run full content-area width. Metric card rows use 3–4 columns with `gap-3`. Charts inside Panel Cards, full card width. No horizontal scroll tiles — data is vertical-first.

**Page width rule:**
- **Full width** — pages with large map canvas (Mapbox, geospatial, fullscreen chart). No max-width on `<main>` or content wrapper.
- **Max-width** — all other pages (dashboard, analytics, report, metrics, alerts, tables). Wrap main content with `max-w-7xl mx-auto w-full` inside `<main>`; header remains full-width.

---

## Chart & Data Visualization Colors

The five brand ramps serve as the categorical color sequence for charts and data series. Always use the base stop for the active data line/bar, `-soft` for area fills and backgrounds.

| Series | Token | Alias | Role |
|--------|-------|-------|------|
| Series 1 | `primary` | `chart-1` | Primary metric line/bar — the dominant data series |
| Series 2 | `secondary` | `chart-2` | Comparison or secondary metric |
| Series 3 | `tertiary` | `chart-3` | Tertiary data series |
| Series 4 | `quaternary` | `chart-4` | Fourth data series or heat indicator |
| Series 5 | `quinary` | `chart-5` | Fifth series or categorical grouping |

Area fill under a line: use `-soft` stop at 15–20% opacity (e.g. `bg-primary-soft/20`).
Grid lines and axis labels: `border-border-primary` / `text-font-secondary`.
Tooltip container: Panel Card style — `bg-background-secondary border border-border-primary`.

---

## Similar Brands

- **Vercel Dashboard** — Near-black primary bg, single-weight sans, cyan/blue accent on dark for active states, border-driven depth without shadows
- **Linear** — Compact information density, controlled color vocabulary, sharp-cornered panels, Montserrat-adjacent type weight hierarchy
- **Grafana** — Full dark canvas, metric-first layout, cyan/teal accent for primary data highlights on dark panel cards
- **Raycast** — Single-surface dark UI, icon-forward navigation, disciplined accent color on dark background
- **Datadog** — Dashboard-native dark mode, data table-first layout, status-coded badge system, tight type scale for dense operational data