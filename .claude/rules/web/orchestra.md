# Orchestra — Rules › Web

> Read this file FIRST before opening any web rule file.
> Load only the smallest set of rules needed for the current task.

## Current Workspace Behavior

This workspace currently keeps its durable web enforcement in:

- `.claude/rules/architecture.md`
- `.claude/skills/web/reactjs/orchestra.md` and the React skill files it routes to

Template-specific nested rule folders under `.claude/rules/web/` may be absent. Do not assume `reactjs/orchestra.md` exists here.

## What To Read Next

| Task type | Read next |
|-----------|-----------|
| Any web implementation or bug fix | `.claude/rules/architecture.md` |
| React page, route, layout, or component work | `.claude/skills/web/reactjs/orchestra.md` |
| New user-facing page/route | `.claude/skills/web/reactjs/app-layout/SKILL.md` and `.claude/skills/web/reactjs/menu-config/SKILL.md` |
| Navigation/menu work | `.claude/skills/web/reactjs/menu-config/SKILL.md` |

## Navigation Contract

- Treat `src/config/menu/*` as the source of truth for navigable pages.
- When adding a user-facing route, wire the route and menu in the same unit of work.
- Hidden routes are opt-in: only skip menu wiring when the task explicitly says the route is hidden, redirect-only, modal-only, or otherwise non-navigable.
