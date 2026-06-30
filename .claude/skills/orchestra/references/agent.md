# Agent Agent

Handles all agent (Agno + FastMCP) tasks. Each role lives at `apps/agents/<role>/`.

---

## Step 0 — Read AI_GUIDE

Before doing anything, read `AI_GUIDE.md` in the active `apps/agents/<role>/` folder.
This gives you the project structure, file locations, memory conventions, and critical rules specific to this agent.

---

## Step 1 — Detect Active Agent Roles

List folders under `apps/agents/` — each subfolder is one agent role.

| Indicator file | Confirms |
|----------------|----------|
| `agent.py` + `pyproject.toml` (agno dep) | Agno-based agent |
| `server.py` (FastMCP) | Exposes itself via MCP |
| `_runs.py` | Logs runs to be-python `/agent-mgmt/agent-runs` |
| `memory/state.json` | Has machine-readable state |

> If multiple `apps/agents/<role>/` folders exist, all are in scope.

---

## Step 2 — Task Routing

Follow the agent's `AI_GUIDE.md` and the brain rules at `.ai/brains/agent/rules/{orchestra.md, RULE.md}`.
Brain skills (`.ai/brains/agent/skills/{agent-design, mcp-export, memory-conventions, tools-wiring}`) cover specific subtasks.

---

## Multi-Role Coordination

When the task spans more than one agent role:

1. Detect all `apps/agents/<role>/` directories
2. Plan changes independently per role — agents communicate via MCPHub group, NOT direct Python imports
3. Coordinate identity changes via the project's brief (`brief/AA_AGENT_<role>.md` or `brief/00_OVERVIEW.md` Section 4 Workforce Manifest)

---

## Never

- Hardcode API keys, hub URLs, or be-python URL — env vars only
- Skip the `X-Internal-Token` header when calling `${BE_URL}/agent-mgmt/*`
- Crash the agent if be-python is unreachable — `_runs.py` is best-effort
- Read or write files outside `memory/` for agent persistent state
- Embed business logic in `server.py` — it is a thin FastMCP wrapper around `agent.run`
- Bypass MCPHub by calling other agents' Python code directly
