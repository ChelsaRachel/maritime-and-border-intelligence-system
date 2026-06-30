# Architecture & Tech Stack

## Tech Stack

| Layer | Allowed Stack |
|-------|--------------|
| Backend | Python/FastAPI (`be-python`) **or** Rust/Axum (`be-rust`) |
| Database | Supabase (Postgres + Auth + Storage + Realtime) |
| Web | React 18 + TypeScript + Rspack/Rsbuild + Zustand + shadcn/ui (`web-reactjs`) |
| Mobile | Flutter MVVM + Provider (`mobile-flutter`) |
| Agent | Agno + FastMCP, OpenRouter LLM (`agent-python`) |
| MCP | FastMCP (`mcp-python`) — bespoke tools when no hub server fits |
| Auth | JWT Bearer (Supabase-issued) + `X-Internal-Token` for system-to-system |
| Telemetry | Agno OpenInference instrumentor → Langfuse OTLP |

---

## Enforcement

Validate stack before generating any code. If requested tech is not listed above:
- Issue a ⚠️ TECH STACK WARNING and stop
- Stack changes only allowed after this file is updated by the user
- Additive libraries (charting, date utils) that don't replace a core layer are exempt

---

## Web UI Enforcement

When implementing UI in any app under `apps/` that uses shadcn/ui:

- Use shadcn/Radix primitives for behavior, accessibility, keyboard support, focus management, portals, forms, and component state.
- Do not treat shadcn default styling as final output.
- Resolve the active design from `design/design-system.md`, then follow `design/[platform]/[theme]/DESIGN.md`.
- Wire shadcn variables and component variants/classes to the active design tokens before judging the component visually.
- Preserve shadcn behavior props such as `asChild`, `aria-*`, `data-*`, refs, controlled values, focus rings, and portal structure.
- Bypass shadcn only for simple static surfaces where it adds no behavior, such as Tactical metric cards, static panels, and wrapper divs.
- App shell regions must not overlap. Header, sidebar, and main content must each have reserved layout space; do not rely on z-index to hide structural overlap.
- If using shadcn Sidebar with a full-width header, account for the sidebar's desktop fixed positioning by offsetting it below the header and reducing its height by the header height.
- Sidebar/header navigation must be config-driven. Define menu entries in `src/config/menu/*` (`APP_MENU`, `ADMINISTRATOR_MENU`, etc.) and render from those arrays; do not hardcode route/menu arrays in layout components.

The active `DESIGN.md` is the authority for final visual classes. For example, if the active theme is Tactical, command dashboard surfaces use Tactical semantic classes such as `bg-background-primary`, `bg-background-secondary`, `text-font-primary`, `text-font-secondary`, `border-border-primary`, `rounded-none`, and `shadow-none`. If another design system is active, use that design system's `DESIGN.md` classes instead.

For Tactical shell layouts, the non-overlap baseline is: root `flex h-screen flex-col overflow-hidden`, header `h-12`, body `flex min-h-0 flex-1 overflow-hidden`, sidebar `top-12 h-[calc(100svh-3rem)] w-[220px]`, and main `flex-1 overflow-auto`.

**Map views:** Any Mapbox map must **fill its designated container frame** (same footprint as the hosting card/panel/slot). Preserve a proper flex height chain (`flex-1 min-h-0` on ancestors; full-width/full-height wrapper around the map). If the canvas sits shorter than the visible frame, fix layout — do not leave empty padding inside the map chrome. Rules: `.claude/skills/reactjs-map/references/map-rules.md` (§ Container & frame contract) and `.claude/skills/reactjs-map/SKILL.md` (Layout).

**Scrollable UI:** Bounded scroll regions inside the app (main column, sidebar body, drawers, panels, feeds, fixed-height lists) **must** use **`react-perfect-scrollbar`** via **`PerfectScrollArea`** (`apps/*/src/components/wrappers/PerfectScrollArea.tsx`). Global thumb/rail theming uses design tokens in **`styles/components.css`** (`.ps__thumb-*`, `.ps__rail-*`) so scrollbars match the active theme. Do **not** rely on raw `overflow-auto` / `scrollbar-thin` as the default for those regions. Exceptions and patterns: `.claude/skills/reactjs-responsive/SKILL.md` § *Scrollable regions*.

---

## Component Placement Enforcement

**Before creating any component, classify it by this decision tree — no exceptions:**

| Question | Answer | Where |
|----------|--------|-------|
| Is it a shadcn/Radix primitive or design-system binding? | Yes | `src/components/ui/` |
| Is it app shell structure (layout, header, sidebar, footer)? | Yes | `src/components/layouts/` |
| Is it a 3rd-party lib adapter (map wrapper, scroll wrapper)? | Yes | `src/components/wrappers/` |
| Is it generic, domain-agnostic, reused by 2+ features? | Yes | `src/modules/{name}/` |
| Is it domain-specific and used only in one domain? | Yes | `src/features/{domain}/{feature}/components/` |
| Is it domain-specific and used by exactly one page? | Yes | `src/pages/{page}/parts/` |

**❌ NEVER place domain-specific components directly in `src/components/`.**
Any component that belongs to a business domain (tactical, billing, dashboard, etc.) — panel content, data displays, domain widgets, status indicators — is a domain component and must live under `src/features/{domain}/{feature}/components/`. Loading it into `src/components/sidebar/`, `src/components/analytics/`, etc. is a structure violation.

When creating a domain component, always consult `.claude/skills/web/reactjs/features/SKILL.md` to decide the correct domain bucket (`features/{domain}/` vs `features/shared/`) before writing any code.

---

## Sprint Closure Enforcement

**Every time a unit of work is completed, the following steps are MANDATORY before moving on:**

1. Open the active sprint task file in `sprint/active/NN-<slug>/<stack>/NN-<task>.md`
2. Mark every `- [ ]` in `## TODOs` → `- [x]`
3. Update `**Status:**` to `✅ Done`
4. When ALL tasks in the sprint are `[x]`, move the sprint folder: `sprint/active/` → `sprint/archive/`
5. Update `sprint/01-sprint-planning.md`: set status `✅ Done`, set `Completed At`, fix folder link to `./archive/`

**Never leave task files with unchecked todos after work is delivered. A sprint is not done until every task file reflects `✅ Done`.**

Additional invariants:

- The task file's top-level `**Status:**` header is the source of truth. A checked closing-checklist line does **not** count if the header still says `📋 Planned` or `🚧 In Progress`.
- If work was scoped by a file under `sprint/`, re-open that file before the final response and verify the header, `## TODOs`, and changelog state are synchronized.
- Do not treat a task as complete based on code changes alone. Sprint/task documentation must be updated in the same unit of work.

Full closure procedure: `.claude/skills/sprint-builder/SKILL.md` § Step 4 (Execute) and § Step 5 (Archive).
