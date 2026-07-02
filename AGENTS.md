# Project Guide


> **CRITICAL FIRST STEP — MANDATORY BEFORE ANY CODE:**
>
> 1. Run `ls apps/` to list all app directories.
> 2. Find and **read** every `AI_GUIDE.md` inside them (`apps/**/AI_GUIDE.md`) relevant to the current task.
> 3. From the `AI_GUIDE.md` Documentation Map, identify **all skills needed** for the task (architecture, slicing-ui, icon, state, etc.) and read them before writing a single line of code.
>
> ❌ **DO NOT write any file — no types, no service, no component, no store — until steps 1–3 above are complete.**
> Skipping `AI_GUIDE.md` causes wrong patterns (wrong icon library, wrong import style, wrong file placement). This has happened before and must not repeat.
>
> Stacks (web, backend, agents, mcp, mobile) are discovered dynamically — do NOT assume fixed folder names. Tasks for a specific stack are handled by their respective domain agent in [`agents/`](agents/).

## Skill Index

Read the index, pick **only** the skill relevant to the current task. Never load all skills blindly. All skills live under [`.claude/skills/`](.claude/skills/).

| Task                                                                                                                                                                                                                                                                           | Skill to load                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Buat desain HTML, build UI, buatkan UI, buat halaman, slice UI, design screen, design html web, design html mobile — **hanya jika tidak ada kata "react", "reactjs", atau target path `apps/`**; jika ada kata "html" eksplisit tetap gunakan skill ini meski ada kata "react" | [`html-ui-styling`](.claude/skills/html-ui-styling/SKILL.md)                          |
| Setup CSS assets, set design system, setup design system, init design system, init mockup folder                                                                                                                                                                               | [`design-system-setup`](.claude/skills/design-system-setup/SKILL.md)                  |
| Design tokens, generate CSS from palette, new theme folder, **buatkan design system**, bikin design system, buat design system untuk [project/brand/URL], create design system, build design system, design system untuk [project], buat token design, buat visual identity    | [`.claude/skill/design-system-builder`](.claude/skill/design-system-builder/SKILL.md) |
| Setup existing design system config (no generation)                                                                                                                                                                                                                            | [`design-system`](.claude/skills/design-system/SKILL.md)                              |
| Figma, shadcn, apply tokens to app code (post-scaffold)                                                                                                                                                                                                                        | [`uiux`](.claude/skills/uiux/SKILL.md)                                                |
| Brief, dokumentasi sistem, Workforce Manifest                                                                                                                                                                                                                                  | [`brief-builder`](.claude/skills/brief-builder/SKILL.md)                              |
| App spec, page inventory                                                                                                                                                                                                                                                       | [`spec-builder`](.claude/skills/spec-builder/SKILL.md)                                |
| Sprint planning, task breakdown per stack                                                                                                                                                                                                                                      | [`sprint-builder`](.claude/skills/sprint-builder/SKILL.md)                            |
| Any coding task (bug, feature, refactor)                                                                                                                                                                                                                                       | [`orchestra`](.claude/skills/orchestra/SKILL.md) first → domain reference             |
| Authoring or refining a skill                                                                                                                                                                                                                                                  | [`skill-creator`](.claude/skills/skill-creator/SKILL.md)                              |

## Context Loading

**Auto-load:** ONLY load `rules/*.md` (root level). Do NOT auto-load nested rules (`rules/**/*.md`) unless specified.

| Task                   | Load                                   |
| ---------------------- | -------------------------------------- |
| Micro (typo, 1-line)   | nothing                                |
| Small (single file)    | relevant skill only                    |
| Medium (feature)       | agents → rules → skills for that stack |
| Large (cross-platform) | full orchestra, parallelize agents     |

## Global Workflow (skill-driven)

This project is built on top of Argus — an agent-driven app builder. The end-to-end workflow runs through the skills in [`.claude/skills/`](.claude/skills/), each invokable via a matching slash command under [`.claude/commands/`](.claude/commands/):

**Project lifecycle phases** (linear, run once per project):

| Phase                              | Slash command        | Skill                                                            | Output                                                                                                                                               |
| ---------------------------------- | -------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Brief**                       | `/brief-builder`     | [`brief-builder`](.claude/skills/brief-builder/SKILL.md)         | `brief/00_OVERVIEW.md` (with Workforce Manifest), `brief/NN_FEATURE.md`, optional `brief/AA_AGENT_<role>.md`                                         |
| **2. App spec**                    | `/spec-builder`      | [`spec-builder`](.claude/skills/spec-builder/SKILL.md)           | `sprint/00-app-spec.md` (single file — page inventory + widget per page + navigation map)                                                            |
| **3. Design tokens**               | `/design-system`     | [`design-system`](.claude/skills/design-system/SKILL.md)         | `design/{platform}/{theme}/` — `DESIGN.md`, `variable.css`, `tailwind.css`, `design-token.json`                                                      |
| **4. HTML mockups**                | `/html-ui-styling`   | [`html-ui-styling`](.claude/skills/html-ui-styling/SKILL.md)     | HTML pages under `mockup/{web,mobile}-html/` (uses [`design-system-setup`](.claude/skills/design-system-setup/SKILL.md) when CSS assets are missing) |
| **5. Supabase setup** _(MVP only)_ | `/supabase-init`     | [`supabase-init`](.claude/skills/supabase-init/SKILL.md)         | `<sandbox>/.supabase/credentials.env` (one-shot per sandbox)                                                                                         |
| **6. Project scaffold**            | `/bootstrap-project` | [`bootstrap-project`](.claude/skills/bootstrap-project/SKILL.md) | `apps/{web,backend,mobile,agent}/` via bundled `init_boilerplate.sh`                                                                                 |
| **7. Sprint plan**                 | `/sprint-builder`    | [`sprint-builder`](.claude/skills/sprint-builder/SKILL.md)       | `sprint/01-sprint-planning.md`, `sprint/{backlog,active,archive}/<sprint>/<stack>/<NN-task>.md`                                                      |
| **8. Agent build**                 | `/agent-builder`     | [`agent-builder`](.claude/skills/agent-builder/SKILL.md)         | `apps/agents/<role>/` registered with MCPHub + `/agent-mgmt/agents`                                                                                  |
| **9. MCP build**                   | `/mcp-builder`       | [`mcp-builder`](.claude/skills/mcp-builder/SKILL.md)             | `apps/mcp/<server>/` registered with MCPHub group                                                                                                    |

**Development cycle** (per-task, invoked repeatedly during sprint execution):

| Trigger                                             | Skill                                            | Role                                                                                                                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Any coding task starts (bug fix, feature, refactor) | [`orchestra`](.claude/skills/orchestra/SKILL.md) | Master task router. Classifies task size (Micro / Small / Medium / Large) and routes to the correct domain reference (`web`, `backend`, `mobile`, `agent`, `review`). Loaded BEFORE any other domain rules/skills. |
| Apply design system into scaffolded app             | `/switch-design-system`                          | —                                                                                                                                                                                                                  | Copies active tokens from `design/` into `apps/<web>/` (see `.claude/commands/switch-design-system.md`) |
| Figma / token resolution for app UI (post-scaffold) | —                                                | [`uiux`](.claude/skills/uiux/SKILL.md)                                                                                                                                                                             | Not a pipeline phase — load when implementing or updating UI inside `apps/`                             |

Skill authoring (orthogonal to both pipeline and dev cycle): trigger [`skill-creator`](.claude/skills/skill-creator/SKILL.md) directly when adding or refining a skill — no slash command, this is a meta workflow.

Sprint status: `backlog/` → `active/` → `archive/` (moved by sprint-builder).

## Decision Tree

| Situation                          | Action                                                                                                                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Starting a new project             | `/brief-builder` → `/spec-builder` → `/design-system` → `/html-ui-styling` → (`/supabase-init` if MVP) → `/bootstrap-project` → `/switch-design-system` → `/sprint-builder` |
| HTML mockup only (no app code yet) | `/html-ui-styling` (+ `/design-system-setup` if `mockup/*/css/` missing)                                                                                                    |
| New feature in existing project    | Check `sprint/active/` → if missing, promote from `sprint/backlog/` (`/sprint-builder`)                                                                                     |
| Starting any coding task           | Load [`orchestra`](.claude/skills/orchestra/SKILL.md) first → classify task size → route to domain reference                                                                |
| Need an agent                      | `/agent-builder` (pre-condition: brief Workforce Manifest exists + be-python scaffolded)                                                                                    |
| Need a bespoke MCP tool            | `/mcp-builder`                                                                                                                                                              |
| New file in an installed stack     | Read `.claude/rules/{platform}/{template}/orchestra.md` → determine path                                                                                                                          |

## Mindset

- **Agent-driven by default.** AI agents are the backbone at runtime — there is no human ops team. Apps must auto-recover, retry, escalate, and observe themselves via be-python's `agent_mgmt` plane.
- **BE = service layer for the workforce of agents.** be-python ships with mandatory `/agent-mgmt/*` router (registry, runs, schedules, webhooks, DLQ, scheduler tick loop). Routes are JWT-admin protected with `X-Internal-Token` bypass for system callers.
- **One role per agent project.** Each `apps/agents/<role>/` is a single Agno agent + FastMCP wrapper, registered to the project's MCPHub group; agents talk to each other via the hub, never via direct Python imports.

## Forbidden Rules

- **Never read or explore any files inside `mockup/`** unless the user explicitly asks. HTML previews in `mockup/` are output artifacts — treat them as opaque.
- **Never read `tailwind.css`, `variable.css`, or `variable_dark.css`** under `design/`. The canonical design reference is **`DESIGN.md`** in the active theme folder (`design/{platform}/{theme}/DESIGN.md`) — read [`design/design-system.md`](design/design-system.md) first to resolve platform + theme.
