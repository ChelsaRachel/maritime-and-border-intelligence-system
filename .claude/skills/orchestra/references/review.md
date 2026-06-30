# Review Agent

Handles code review tasks across all platforms and stacks.

---

## Scope

Use this agent when:
- Reviewing a PR or branch diff
- Auditing a new feature before merging
- Checking rule/convention compliance after implementation
- Post-implementation quality check on any stack

---

## Step 1 — Identify What Changed

```
git diff main...HEAD --name-only
```

Group changed files by domain:

| Files changed | Domain |
|---------------|--------|
| `apps/web*`, `apps/fe*` | Web frontend |
| `apps/mobile*` | Mobile |
| `apps/be*`, `apps/backend*` | Backend |
| `apps/agents/*` | Agent (Agno + FastMCP) |
| `apps/mcp/*` | MCP server |
| `sprint/`, `brief/` | Planning / sprint docs |

---

## Step 2 — Load Domain Rules for Each Changed Domain

| Domain | Rules to load |
|--------|--------------|
| Web | `rules/web/{ttype}/orchestra.md` → relevant rule files |
| Mobile | `rules/mobile/flutter/orchestra.md` → relevant rule files |
| Backend | `rules/backend/orchestra.md` → relevant rule files |
| Agent | `.ai/brains/agent/rules/{orchestra.md, RULE.md}` |
| API contract | `rules/backend/api.md` + `docs/api-spec.md` |
| DB changes | `rules/backend/database.md` + `docs/database-schema.md` |

---

## Review Checklist

### All Stacks
- [ ] No hardcoded secrets, tokens, or credentials
- [ ] No commented-out dead code left behind
- [ ] No `console.log` / `print()` / `debugPrint()` debugging remnants
- [ ] Naming conventions match stack rules

### Backend
- [ ] No DB queries directly in router/controller
- [ ] All protected routes have auth middleware applied
- [ ] New endpoints registered in `docs/api-spec.md`
- [ ] Response follows standard envelope format
- [ ] Pagination uses `FindDTO` pattern for list endpoints

### Web
- [ ] No inline styles — design system tokens or Tailwind only
- [ ] No business logic inside component render functions
- [ ] Forms use approved form library pattern

### Mobile
- [ ] No logic in widget `build()` methods
- [ ] All API calls via service layer, not directly from widgets
- [ ] Provider used for shared state — no raw `setState` for global state

### Agent
- [ ] No hardcoded API keys / hub URLs / be-python URL — env vars only
- [ ] `_runs.py` calls include `X-Internal-Token` header
- [ ] Agent does not crash when be-python is unreachable (best-effort run logging)
- [ ] State writes confined to `memory/` (state.json, notes.md, runs/<ts>.md)
- [ ] `server.py` is a thin FastMCP wrapper — no business logic

### MCP
- [ ] Tool signatures are typed (Pydantic / type hints)
- [ ] Errors raised as `ToolError` with clear classification (transient vs non-recoverable)
- [ ] No secrets committed in `.env.example` — only placeholder names

---

## Output Format

Report findings grouped by severity:

```
🔴 BLOCKING   — must fix before merge (security, broken contract, wrong pattern)
🟡 WARNING    — should fix (convention violation, missing doc update)
🟢 SUGGESTION — optional improvement (clarity, minor optimization)
```

One line per finding: file path + line + description.

---

## Never

- Block a merge on style-only issues if conventions are otherwise followed
- Suggest refactors outside the scope of changed files
- Load the full codebase — only review what changed
