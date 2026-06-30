# Orchestra — Rules › Agent

> Read this file FIRST before opening any agent rule file.
> Discover the installed `{ttype}` folder, then load only what the task needs.

## Discover Installed Template

List subfolders in `.claude/rules/agent/` to find the active template type:

| Template | Folder | Populated by |
|----------|--------|--------------|
| Agno + FastMCP (Python) | `agent/` | `python .ai init --template=agent-python` |

Once the folder exists, open its orchestra first:
- `agent/` → [`agent/orchestra.md`](agent/orchestra.md)

> If no subfolder exists (only `.gitkeep`), fall back to global rules — no agent-specific rules are loaded.

> The brain-level orchestra/rule for agent-python lives at `.ai/brains/agent/rules/{orchestra.md, RULE.md}` and gets injected into the scaffolded project's `.claude/rules/agent/agent/` (mirroring the web→reactjs and backend→python pattern).
