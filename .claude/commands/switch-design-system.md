# Command: /switch-design-system

Apply the **active** design system from the workspace `design/` folder into a target app under `apps/`. Do **not** invent a new theme name — derive everything from `design/design-system.md`.

## Trigger

`/switch-design-system [app-folder]`

- If `[app-folder]` is omitted, infer the primary web app (e.g. `apps/web`) from context or ask once which app under `apps/` to update.

## Mandatory first reads

The **authoritative styling contract for every component** lives in **`DESIGN.md`** for the active theme. Skills below explain *how* to apply it in code; without loading them, token/CSS updates alone will miss composition, variants, and shell patterns.

### `components/ui/` — base primitives (non-negotiable)

Everything under **`apps/<target>/src/components/ui/`** is the **base component layer** (shadcn/Radix primitives). After a design-system switch, **every file in this folder must conform** to the active design system: default classes, `cva` variants, radii, rings, typography, and semantic colors must match **`DESIGN.md`** and the token chain — not upstream shadcn defaults. Treat this directory as a **full audit list**: Button, Input, Dialog, Card, `sidebar.tsx`, etc.; leaving any primitive on the old theme breaks downstream pages that compose from `ui/`.

### A — Workspace routing & contract file

1. **`design/design-system.md`** — read the **Active Config** table for `platform` and `theme`. All canonical paths use these two values only.
2. **`design/[platform]/[theme]/DESIGN.md`** — read **before** editing any app file. This file defines palette usage, semantic Tailwind classes, forbidden patterns, card/sidebar/table/dialog recipes, typography scale, and how each surface should be composed after a switch.

### B — Skills (load every run; order matters)

3. **`.claude/skills/reactjs-switch-theme/SKILL.md`** — mechanical pipeline: copy/adapt `variable.css`, `tailwind.css`, fonts, `<html>` default mode, verification, Step 7 composition audit (Steps 0–7). Entry point for *files on disk*.

4. **`.claude/skills/reactjs-design-system/SKILL.md`** — **DESIGN.md-centric**: composition is mandatory; shadcn behavior first, then override visuals to match active `DESIGN.md`; token wiring vs variant/class overrides.

5. **`.claude/skills/reactjs-slicing-ui/SKILL.md`** — **DESIGN.md-centric**: full token chain (`design-system.md` → `DESIGN.md` → CSS → Tailwind → components); composition map from `DESIGN.md`; editing **`components/ui/*`** primitives when themes diverge.

6. **`.claude/skills/reactjs-sidebar/SKILL.md`** — when the app shell uses shadcn Sidebar: layout offsets, `SIDEBAR_WIDTH`, menu/active/hover classes — all must follow the **sidebar rules in active `DESIGN.md`** (often requires edits to `sidebar.tsx` + layout).

7. **`.claude/skills/reactjs-app-layout/SKILL.md`** — **shell + regions**: `AppLayout`, `AppHeader`, topbar vs sidebar vs main — no overlapping regions; offsets when Sidebar is `fixed`; route/`Outlet` wiring; **active `DESIGN.md` shell contract** (header height, sidebar width, canvas/surface tokens). Required whenever the theme switch touches layout files.

### C — Optional context

- **`.claude/skills/uiux/SKILL.md`** — only if you need broader `./design/` resolution or Figma alignment; **active `DESIGN.md` still wins** for class names and composition during a theme switch.

Canonical sources (replace `[platform]` and `[theme]` from Active Config):

| Asset | Path |
| ----- | ---- |
| Contract + class map | `design/[platform]/[theme]/DESIGN.md` |
| CSS variables | `design/[platform]/[theme]/variable.css` |
| Tailwind `@theme` | `design/[platform]/[theme]/tailwind.css` |

## Execution steps (summary — details live in the skill)

1. **Step 0** — Resolve active `platform` + `theme` from `design/design-system.md`. Read `DESIGN.md` for that theme before editing files.

2. **Step 1** — Copy `design/[platform]/[theme]/variable.css` → `apps/<target>/src/styles/variables.css` (preserve any project-specific CSS suffix rules described in the skill).

3. **Step 2** — Adapt app theme file from canonical `tailwind.css` (this repo often uses `src/styles/tailwind.css` or `theme.css`): merge with existing `@theme inline`, keep `@import "tailwindcss"` only in `index.css`, preserve project animations.

4. **Step 3** — Update Google Fonts (or equivalent) in `index.html` per **active** `DESIGN.md`.

5. **Step 4** — Set default mode on `<html>` (`class="dark"` or not) per **primary mode** in **active** `DESIGN.md`.

6. **Step 5** — Verify in browser (surfaces, font, dark toggle, palette cleanup).

7. **Step 6** — Token chain integrity: `DESIGN.md` → canonical CSS → app CSS → components.

8. **Step 7 — CRITICAL** — Composition alignment: (a) **audit every file under `components/ui/`** and align defaults/variants to **active** `DESIGN.md`; (b) audit **app shell** (`components/layouts/*`, `AppLayout`, regions per **app-layout** skill); (c) audit composed surfaces (cards, tables, dialogs, etc.). Adjust primitives and layouts where defaults still reflect the old theme — **preserve Radix/shadcn behavior and a11y**, change presentation only.

## Output

- List every file created or modified with a one-line reason.
- Do not mark complete until Step 7 composition checks pass for the **active** theme.

## References

- Theme files & verification: `.claude/skills/reactjs-switch-theme/SKILL.md`
- Composition & shadcn vs `DESIGN.md`: `.claude/skills/reactjs-design-system/SKILL.md`
- Token chain & UI primitives: `.claude/skills/reactjs-slicing-ui/SKILL.md`
- Sidebar shell: `.claude/skills/reactjs-sidebar/SKILL.md`
- App shell (layout regions, header/sidebar/main): `.claude/skills/reactjs-app-layout/SKILL.md`
- Optional checklist: `.claude/skills/reactjs/switch-theme/references/switch-theme-rules.md`
