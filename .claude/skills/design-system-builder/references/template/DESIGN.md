# {THEME_NAME} — Style Reference
> {ONE_LINE_DESIGN_PHILOSOPHY} — {CORE_PRINCIPLES_3_TO_5_WORDS_EACH}.

**Theme:** {light | dark | system}

{NARRATIVE_PARAGRAPH: 4–6 sentences. Describe the design character. Cover: surface stack depth, radius philosophy, how hierarchy is expressed (type vs color vs spacing), primary color discipline, and the emotion/function the system targets. Be declarative — every sentence should constrain AI generation choices. Example below is Tactical.}

> **Example (Tactical):** Tactical is a command interface — every decision is load-bearing. The surface stack is lean and deliberate (`bg-background-primary` → `bg-background-secondary`): two steps, no more. No radius — corners are square, surfaces are flat, edges are hard. Color does not carry hierarchy — Montserrat's weight range (`font-regular` → `font-bold`) and spatial rhythm do. `primary` appears only where action is required: CTAs, active states, and critical data callouts. All other color is semantic — state, category, data series — never decorative.

---

## Colors

> Hex values listed for reference only. Never hardcode in implementation — always use the Tailwind token.

> Every color token has a companion `-fg` foreground token for text placed directly on that background. Pattern: `bg-{token}` → `text-{token}-fg`. Example: `bg-primary text-primary-fg`, `bg-error-light text-error-light-fg`, `bg-success text-success-fg`.

### Surface

{INSTRUCTION: Define 5–7 surface tokens. Always include: a base canvas, one elevated surface (panel/card), a sidebar token, and a primary + secondary border. Add semantic aliases (bg-card, bg-sidebar) that point to the same hex as the panel — these aliases express intent.}

| Name | Hex (info) | Tailwind Token | Role |
|------|-----------|----------------|------|
| {NAME} | `#{HEX}` | `bg-background-primary` | Main page background — the canvas all panels sit on |
| {NAME} | `#{HEX}` | `bg-background-secondary` | Generic elevated surface — base token; prefer semantic aliases below |
| {NAME} | `#{HEX}` | `bg-card` | Cards, stat blocks, widget containers, data panels |
| {NAME} | `#{HEX}` | `bg-sidebar` | Sidebar nav container |
| {NAME} | `#{HEX}` | `border-border-primary` | All borders and dividers — the single border tone across all components |
| {NAME} | — | `border-border-secondary` | Stronger emphasis borders, focus rings |

### Brand

> Each brand ramp has five stops: `light` → `soft` → `base` → `bold` → `deep`. Each stop also has a `-fg` foreground token for text placed directly on that background.

{INSTRUCTION: Define 5 brand colors. Brand 1 = primary CTA. Brands 2–5 = chart series and semantic accents. Assign a short evocative name and a role for each. Use the 5-stop ramp pattern for all.}

| Brand | Name | Base Hex (info) | Token Prefix | Role |
|-------|------|----------------|--------------|------|
| Primary | {NAME} | `#{HEX}` | `primary-*` | Main CTA, active states, data callouts — the system's sole primary accent |
| Secondary | {NAME} | `#{HEX}` | `secondary-*` | Supporting actions, chart series 2, secondary data highlights |
| Tertiary | {NAME} | `#{HEX}` | `tertiary-*` | Warning-adjacent highlights, chart series 3, attention callouts |
| Quaternary | {NAME} | `#{HEX}` | `quaternary-*` | Chart series 4, heat indicators, high-priority labels |
| Quinary | {NAME} | `#{HEX}` | `quinary-*` | Chart series 5, categorical grouping, advanced/admin indicators |

Token usage pattern: `bg-{brand}-{stop}` / `text-{brand}-{stop}` / `border-{brand}-{stop}` / `text-{brand}-{stop}-fg`

The `-fg` suffix denotes the foreground (text) color intended for use **on top of** that background stop — e.g., `text-primary-fg` is the text color on `bg-primary`, `text-primary-light-fg` is text on `bg-primary-light`.

Example: `bg-primary text-primary-fg`, `bg-secondary-light text-secondary-light-fg`, `border-tertiary-soft`

#### Neutral Colors

`bg-neutral-light / soft / base / bold / deep` — same pattern. Each stop has a matching `text-neutral-{stop}-fg` foreground token.

### State Colors (bg / text / border)

{INSTRUCTION: Keep the 4 semantic states. Adjust hex values in variable.css to fit the theme's palette. The role descriptions below are fixed — do not change them.}

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

{INSTRUCTION: 5 text tokens are required. Keep names and roles fixed — adjust hex values in variable.css only.}

| Token | Role |
|-------|------|
| `text-font-primary` | Default text — body, headings, table data |
| `text-font-secondary` | Muted copy, captions, table headers, helper labels |
| `text-font-placeholder` | Input placeholder text |
| `text-font-disabled` | Disabled input and control labels |
| `text-font-on-accent` | Text on filled `primary` or accent backgrounds |

---

## Typography

### {FONT_FAMILY} — {ONE_SENTENCE_TYPEFACE_RATIONALE}

{INSTRUCTION: One typeface only. Explain in 2–3 sentences why this family was chosen and how its weight range drives hierarchy without family-switching.}

- **Substitute:** {GOOGLE_FONTS_OR_SYSTEM_FALLBACK}
- **Weights:** `font-regular` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)
- **Base size:** `text-body-lg` ({PX}px)
- **Line height:** {leading-* at display sizes}, {leading-* at body sizes}
- **Letter spacing:** `tracking-normal` across all sizes

### Font Family Tokens

| Token | Font | Digunakan untuk |
|-------|------|-----------------|
| `font-sans` | {BODY_FONT_NAME} | Body, UI copy, labels, inputs |
| `font-serif` | {HEADING_FONT_NAME} | Display, h1–h4, stat numbers |
| `font-mono` | {MONO_FONT_NAME} | Code, data values, timestamps |

### Type Scale

{INSTRUCTION: 9 roles minimum. Keep the token names (text-label-sm through text-display). Adjust sizes and weights to reflect the theme's density. Compact = smaller gaps; Airy = larger.}

| Role | Size Token | Size | Weight Token | Line Height Token |
|------|-----------|------|--------------|-------------------|
| Caption / badge | `text-label-sm` | {PX}px | `font-regular` | `leading-snug` |
| Label | `text-label-md` | {PX}px | `font-medium` | `leading-snug` |
| Body small | `text-body-sm` | {PX}px | `font-regular` | `leading-normal` |
| Body | `text-body-lg` | {PX}px | `font-regular` | `leading-relaxed` |
| Subheading | `text-h6` | {PX}px | `font-semibold` | `leading-snug` |
| Heading small | `text-h5` | {PX}px | `font-semibold` | `leading-tight` |
| Heading | `text-h4` | {PX}px | `font-bold` | `leading-tight` |
| Metric | `text-h2` | {PX}px | `font-bold` | `leading-tight` |
| Display | `text-display` | {PX}px | `font-bold` | `leading-none` |

---

## Spacing & Layout

**Base unit:** `spacing-2` (8px)

**Density:** {compact | comfortable | airy}

{INSTRUCTION: Fill in spacing values to match the chosen density. Compact = tighter padding. Keep the list of properties fixed.}

- **Page width:** conditional — full width for map/canvas pages; `max-w-{SIZE} mx-auto` for all other pages
- **Section gap:** `gap-{N}`
- **Card padding:** none on container — padding lives on card header (`px-{N} py-{N}`) and card body (`px-{N} py-{N}`)
- **Element gap:** `gap-{N}`
- **Sidebar width:** {PX}px expanded / {PX}px collapsed

---

## Components

{INSTRUCTION: Define all 11 components below. For each: preserve the Role line, write the base Tailwind class string, add hover/focus/active state classes, and add a 1–2 sentence behavioral note. Do NOT invent new component names — add variants inside the existing ones.}

### Primary Button
**Role:** Main CTA — Save, Confirm, Apply filter, Export

`bg-primary text-font-on-accent font-sans text-body-sm font-semibold px-{N} py-{N}`

Hover → `hover:bg-primary-bold`. {ADDITIONAL_NOTES}

### Border Button
**Role:** Secondary actions, cancel, adjacent controls

`bg-background-primary border border-border-primary text-font-primary px-{N} py-{N}`

{BEHAVIORAL_NOTE}

### Destructive Button
**Role:** Delete, remove, terminate operations

`bg-error text-font-primary px-{N} py-{N}`

Hover → `hover:bg-error-bold`. Use only for irreversible actions.

### Ghost Button
**Role:** Inline tertiary actions, icon-only controls

`text-primary` — no background, no border. {BEHAVIORAL_NOTE}

### Segmented Button / Timeframe Toggle
**Role:** Mutually exclusive filter or timeframe selection — a group of inline buttons where exactly one is active at a time

Base (inactive): `px-{N} py-{N} text-label-sm font-medium border border-border-primary text-font-secondary`

Active: `px-{N} py-{N} text-label-sm font-semibold border border-primary bg-primary text-font-on-accent`

Borders collapse between siblings (`border-left:none` on all but the first). {RADIUS_NOTE}. JS toggles active by swapping inactive → active classes.

### Panel Card
**Role:** Stat blocks, data tables, form sections, widget containers

Container: `bg-card border border-border-primary` — no padding on the container itself.

Card header: `px-{N} py-{N}` — no border-b by default; add `border-b border-border-primary` only when explicit separation from the body is needed.
Card body: `px-{N} py-{N}`
Card footer: `px-{N} py-{N} border-t border-border-primary`

{SHADOW_NOTE}

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

{ALTERNATING_ROW_NOTE}

### Sidebar / Nav
**Role:** Primary navigation container

`bg-sidebar border-r border-border-primary` — fixed width {PX}px (collapsed: {PX}px icon-only).

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

`bg-background-secondary border border-border-primary px-{N} py-{N} font-sans text-body-lg font-regular text-font-primary placeholder:text-font-placeholder`

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

{TAB_STYLE_NOTE: pill or underline}. Spacing: `py-{N} gap-{N}`.

### Header / Top Bar
**Role:** Global page-level nav strip

`bg-background-secondary border-b border-border-primary h-{N}`

- Left: wordmark or breadcrumb — `text-body-lg font-semibold text-font-primary`
- Center: optional search input
- Right: icon actions (`text-font-secondary`) + Primary Button

---

## Do's and Don'ts

{INSTRUCTION: Keep the structural rules below. Replace the example-specific content in each bullet with constraints derived from the chosen theme. Each Do must be a positive constraint; each Don't must name a specific forbidden pattern.}

### Do
- Use `bg-card` for all card and panel surfaces, `bg-sidebar` for sidebar/nav containers — semantic aliases express intent.
- Apply `primary` exclusively to primary actions, active states, and key data highlights.
- {TYPOGRAPHY_HIERARCHY_RULE}
- {RADIUS_RULE — state "never use radius" or define max radius value}
- {ICON_USAGE_RULE}
- {SURFACE_STACK_RULE — max N background tones per view}
- Use `text-font-secondary` for all secondary text — captions, table headers, label copy, placeholder text.

### Don't
- Don't use `primary` as a card background, decoration, or repeated highlight — scarcity is its power.
- {RADIUS_DONT — matching the radius rule above}
- {TYPEFACE_DONT}
- {SHADOW_DONT}
- Don't use color for decorative purposes — every color must encode a semantic or functional state.
- Don't place body text at `text-label-sm` or below — compact density is achieved through spacing and weight hierarchy.
- **Never use Tailwind opacity modifiers on color tokens** (`bg-error/15`, `bg-primary/10`, `border-primary/30`, etc.) — these bypass the design system. Always use the designated semantic scale instead: `bg-error-light`, `bg-primary-soft`, `border-error-soft`, etc. If a semantic token doesn't exist, add one to `variable.css` first.

---

## Elevation

{INSTRUCTION: Always express depth through background color steps, not shadows. Keep this table structure. Fill in tokens that match the surface palette defined above.}

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

{INSTRUCTION: Write one dense paragraph (5–8 sentences) covering: canvas approach, sidebar dimensions, header height, primary grid strategy (12-col or auto-fit), gap values, card padding convention, table width, metric card column count, chart placement. Then define the page width rule for full-width vs max-width pages.}

{LAYOUT_PARAGRAPH}

**Page width rule:**
- **Full width** — pages with large map canvas (Mapbox, geospatial, fullscreen chart). No max-width on `<main>` or content wrapper.
- **Max-width** — all other pages (dashboard, analytics, report, metrics, alerts, tables). Wrap main content with `max-w-{SIZE} mx-auto w-full` inside `<main>`; header remains full-width.

---

## Chart & Data Visualization Colors

{INSTRUCTION: Map the 5 brand ramps to chart series 1–5 in order. Always use base stop for active line/bar, -soft for area fills. Grid and axis styling is fixed.}

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

{INSTRUCTION: List 4–5 real products whose visual language overlaps with this design system. One sentence each — focus on the specific shared trait (surface approach, type weight discipline, color vocabulary, density). This section helps AI calibrate the intended aesthetic register.}

- **{PRODUCT}** — {SHARED_TRAIT}
- **{PRODUCT}** — {SHARED_TRAIT}
- **{PRODUCT}** — {SHARED_TRAIT}
- **{PRODUCT}** — {SHARED_TRAIT}
- **{PRODUCT}** — {SHARED_TRAIT}

---

<!--
GENERATION CHECKLIST — remove this block after generation is complete

Theme identity:
[ ] THEME_NAME and tagline filled
[ ] Theme (light/dark/system) set
[ ] Narrative paragraph written — constrains AI choices

Colors:
[ ] 6 surface tokens defined (canvas, panel, card, sidebar, border-primary, border-secondary)
[ ] 5 brand colors chosen with hex + role
[ ] State colors acknowledged (hex in variable.css, roles unchanged)
[ ] 5 text tokens acknowledged (hex in variable.css, roles unchanged)

Typography:
[ ] Single typeface chosen + rationale written
[ ] All 9 type scale rows filled (px sizes + weights)

Spacing:
[ ] Density level set (compact / comfortable / airy)
[ ] All 5 spacing properties filled

Components:
[ ] All 13 components filled with Tailwind classes
[ ] Hover/focus states specified
[ ] Behavioral notes added where marked

Rules:
[ ] Do: 7 rules filled
[ ] Don't: 7 rules filled (opacity modifier rule preserved verbatim)

Elevation & Surfaces: unchanged — tokens reference surface palette above

Layout:
[ ] Layout paragraph written
[ ] Page width rule filled

Charts: unchanged — tokens reference brand palette above

Similar brands: 4–5 products listed with shared traits
-->
