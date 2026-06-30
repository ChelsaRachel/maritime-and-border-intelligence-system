---
name: orchestra
description: Master task router and orchestration guide for all development work in this workspace. Use this skill at the start of every coding task to classify the task size and route it to the correct domain agent (web, backend, mobile, agent/MCP, review). Triggers: any implementation, bug fix, feature request, code review, or planning task — regardless of stack. Also handles sprint planning (sprint-builder), brief building (brief-builder), and **static HTML** work (`html-ui-slicing`) routing.
---

# Orchestra

## Before Loading Any Context

Classify task first:
- Micro (typo, rename, 1-line fix) → no context load, just do it
- Small (single file change) → load only relevant skill
- Medium (feature, multi-file) → load domain orchestra → skill → rules
- Large (new feature cross-platform) → full context load + parallelize agents

---

## Routing

| Task | Agent |
|------|-------|
| Web frontend | [web.md](references/web.md) |
| Backend API / DB | [backend.md](references/backend.md) |
| Mobile | [mobile.md](references/mobile.md) |
| Agent (Agno + FastMCP) | [agent.md](references/agent.md) |
| Code review | [review.md](references/review.md) |

---

## When to Parallelize

Parallelize when tasks are **independent** (no shared state, no sequential dependency):

- Web + Mobile + Backend changes for the same feature → spawn all 3 agents at once
- Multiple unrelated bug fixes on different files → parallel
- Read-only research across different domains → parallel

---

## Never

- Spawn subagent for Micro or Small tasks
- Parallelize tasks that are sequential (step B depends on step A output)
- Start implementation before the stack orchestra has been read
- Load more context after enough context to complete the task is already loaded

---

## Planning & Sprint

- Sprint planning is owned by the `sprint-builder` skill
- Brief building is owned by the `brief-builder` skill
- Review sprint / update backlog?
  → use `sprint-builder` skill
  → Read `sprint/01-sprint-planning.md`
  → Read `brief/00_OVERVIEW.md` (the project blueprint)
- Check active sprint?
  → Read: `sprint/active/`
- Implementing work from a task file under `sprint/`?
  → use `sprint-builder` skill before coding, not only for planning
  → read the specific task file that scopes the work
  → before finalizing, reopen that task file and perform sprint closure sync (`TODOs` / `Status` / changelog)

---

## Static HTML — slicing & PoC (repo-level, not `apps/web*`)

Use this branch when the deliverable is **standalone HTML** (mockup folders or single-file PoC) and the user is **not** asking to implement inside `apps/web*/` unless they say so explicitly.

| Task shape | Skill |
|------------|--------|
| **All** static HTML: mockup packages **or** single-file workspace PoC from spec/brief (`html-ui-slicing` **Mode A** vs **Mode B** — see that skill’s Step 0) | [`html-ui-slicing`](../html-ui-slicing/SKILL.md) |

**Heuristics**

- “Slice UI”, mockup under `mockup/`, themed static pages from `design/` → **Mode A** in `html-ui-slicing`.
- “Design HTML”, PoC dari `<cwd>/sprint/00-app-spec.md` atau `<cwd>/brief/`, satu file di `<cwd>/design/` → **Mode B** — follow [`references/workspace-spec-poc.md`](../html-ui-slicing/references/workspace-spec-poc.md) inside that skill.

Do **not** force-read `apps/web*/AI_GUIDE.md` for pure static HTML unless the user wants a **port** into the app; then classify as **Web** after the artifact exists.

---

## Efficiency Rules

- Read orchestra.md/index per domain BEFORE loading any detail file
- Load skills/rules ONLY when task matches
- Load docs (api-spec, db-schema) ONLY when task touches API or DB
- If task is small (1 file fix, typo, rename) → skip all context loading
- STOP loading more context once enough to complete the task
- NEVER load design/* unless task is UI-related
- NEVER load brief/* unless task is planning-related
- NEVER ignore `sprint/*` when the user is working from a sprint task file or asks to complete/continue a sprint-scoped task
